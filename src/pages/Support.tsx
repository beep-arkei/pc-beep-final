import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, Mail, MapPin, ChevronDown, ChevronUp, ShieldCheck, Truck, 
  HelpCircle, Send, Loader2, CheckCircle, MessageSquare, Bot, User, 
  Plus, Image as ImageIcon, X, Paperclip, History, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import { generateAiResponse } from '../services/geminiService';
import { uploadChatAttachment } from '../lib/storage';

interface Message {
  id?: string;
  role: 'user' | 'bot' | 'admin';
  text: string;
  created_at?: string;
  status?: 'sending' | 'sent' | 'error';
}

interface Chat {
  id: string;
  status: string;
  is_ai_active: boolean;
  created_at: string;
  assigned_admin_id: string | null;
}

export const Support: React.FC = () => {
  const { user } = useStore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(localStorage.getItem('beep_chat_id'));
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [isAiActive, setIsAiActive] = useState(true);
  const [chatStatus, setChatStatus] = useState('active');
  const [uploading, setUploading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const fetchChats = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setChats(data);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch user's chat history
  useEffect(() => {
    fetchChats();
  }, [user]);

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChatId) {
      setMessages([{ role: 'bot', text: 'Hello! I am Beep Bot. How can I help you today?' }]);
      return;
    }

    const fetchMessages = async () => {
      setChatLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', selectedChatId)
        .order('created_at', { ascending: true });

      if (data) setMessages(data);
      
      const { data: chat } = await supabase
        .from('chats')
        .select('is_ai_active, status')
        .eq('id', selectedChatId)
        .single();
      
      if (chat) {
        setIsAiActive(chat.is_ai_active);
        setChatStatus(chat.status);
      }
      setChatLoading(false);
    };

    fetchMessages();
    fetchChats(); // Initial fetch

    // Subscribe to messages updates
    const messageChannel = supabase
      .channel(`support_chat:${selectedChatId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chat_messages',
        filter: `chat_id=eq.${selectedChatId}`
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prev => {
          // Replace optimistic message if it exists
          const optimisticIdx = prev.findIndex(m => 
            m.role === newMessage.role && 
            m.text === newMessage.text && 
            (m.status === 'sending' || m.status === 'sent')
          );

          if (optimisticIdx !== -1) {
            const newMsgs = [...prev];
            newMsgs[optimisticIdx] = { ...newMessage, status: 'sent' };
            return newMsgs;
          }

          if (prev.some(m => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chats',
        filter: `id=eq.${selectedChatId}`
      }, (payload) => {
        setIsAiActive(payload.new.is_ai_active);
        setChatStatus(payload.new.status);
      })
      .subscribe();

    // Subscribe to chats updates (for real-time sidebar updates)
    const chatChannel = supabase
      .channel('user_chats')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chats',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchChats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(chatChannel);
    };
  }, [selectedChatId, user]);

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault();
    const textToSend = customText || input.trim();
    if (!textToSend || loading || !user) return;

    if (!customText) setInput('');
    
    // Optimistic update
    const optimisticMessage: Message = { 
      role: 'user', 
      text: textToSend, 
      status: 'sending',
      created_at: new Date().toISOString() 
    };
    
    setMessages(prev => [...prev, optimisticMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend,
          chatId: selectedChatId,
          userId: user.id
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send message');

      const activeChatId = data.chatId;
      if (activeChatId && activeChatId !== selectedChatId) {
        setSelectedChatId(activeChatId);
        localStorage.setItem('beep_chat_id', activeChatId);
      }

      // Update optimistic message to 'sent'
      setMessages(prev => prev.map(m => 
        (m.text === textToSend && m.status === 'sending') ? { ...m, status: 'sent' } : m
      ));

      if (data.isAiActive) {
        const history = [...messages, optimisticMessage];
        const botText = await generateAiResponse(textToSend, history);
        if (botText) {
          await supabase.from('chat_messages').insert({
            chat_id: activeChatId,
            role: 'bot',
            text: botText
          });
        }
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => prev.map(m => 
        (m.text === textToSend && m.status === 'sending') ? { ...m, status: 'error' } : m
      ));
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const url = await uploadChatAttachment(file);
      const markdownImage = `![attachment](${url})`;
      await handleSend(undefined, markdownImage);
      toast.success('Image uploaded!');
    } catch (error: any) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const startNewChat = () => {
    setSelectedChatId(null);
    localStorage.removeItem('beep_chat_id');
    setMessages([{ role: 'bot', text: 'Hello! I am Beep Bot. How can I help you today?' }]);
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <Bot size={64} className="text-cyan mx-auto mb-6" />
        <h1 className="text-4xl font-black text-navy uppercase tracking-tighter mb-4">Live <span className="text-cyan">Chat</span></h1>
        <p className="text-slate-500 mb-8">Please login to access live support and chat with Beep Bot.</p>
        <a href="/auth" className="px-8 py-4 bg-navy text-white font-black rounded-sm hover:bg-navy/90 transition-all">LOGIN TO CONTINUE</a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-180px)] min-h-[600px] flex flex-col">
      {/* Header Tabs */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-navy rounded-sm flex items-center justify-center shadow-none border border-white/10">
            <Bot className="text-cyan" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-navy uppercase tracking-tighter">Live <span className="text-cyan">Chat</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your personal PC assistant</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-sm">
          <button 
            className="px-6 py-2 rounded-sm text-xs font-black uppercase tracking-widest bg-white text-navy shadow-none border border-slate-200 flex items-center gap-2"
          >
            <MessageSquare size={14} /> Live Support
          </button>
          <Link 
            to="/help"
            className="px-6 py-2 rounded-sm text-xs font-black uppercase tracking-widest text-slate-500 hover:text-navy transition-all flex items-center gap-2"
          >
            <HelpCircle size={14} /> Help Center
          </Link>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-8 overflow-hidden">
          {/* Sidebar: History */}
          <div className="lg:col-span-1 flex flex-col gap-4 overflow-hidden">
            <button 
              onClick={startNewChat}
              className="w-full py-4 bg-cyan text-navy font-black rounded-sm hover:bg-cyan/90 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={18} /> NEW SUPPORT TICKET
            </button>
            
            <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Recent Conversations</h3>
              {chats.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-sm border border-dashed border-slate-200">
                  <History size={24} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No history yet</p>
                </div>
              ) : (
                chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={cn(
                      "w-full p-4 rounded-sm border transition-all text-left group",
                      selectedChatId === chat.id 
                        ? "border-cyan bg-cyan/5" 
                        : "border-slate-100 hover:border-slate-200 bg-white"
                    )}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-black text-navy text-xs uppercase tracking-tight">
                        Ticket #{chat.id.slice(0, 8)}
                      </span>
                      <span className={cn(
                        "text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                        chat.status === 'active' ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-500"
                      )}>
                        {chat.status}
                      </span>
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(chat.created_at).toLocaleDateString()}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Main: Chat Thread */}
          <div className="lg:col-span-3 bg-white rounded-sm border border-slate-200 shadow-none flex flex-col overflow-hidden relative">
            {/* Thread Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-sm border border-slate-100 flex items-center justify-center shadow-none">
                  {isAiActive ? <Bot className="text-cyan" size={20} /> : <User className="text-navy" size={20} />}
                </div>
                <div>
                  <div className="font-black text-navy text-sm uppercase tracking-tight">
                    {isAiActive ? 'Beep Bot' : 'Human Agent'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              {!isAiActive && (
                <div className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck size={12} /> Live Support Active
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div 
              ref={messagesContainerRef}
              className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar"
            >
              {chatLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Loader2 className="animate-spin mb-4" size={32} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Loading conversation...</p>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={idx}
                      className={cn(
                        "flex flex-col",
                        msg.role === 'user' ? "items-end" : "items-start"
                      )}
                    >
                      <div className={cn(
                        "flex items-center gap-2 mb-1",
                        msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                      )}>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                          {msg.role}
                        </span>
                        {msg.created_at && (
                          <span className="text-[8px] font-bold text-slate-300">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <div className={cn(
                        "max-w-[85%] p-4 rounded-sm shadow-none relative",
                        msg.role === 'user' 
                          ? "bg-navy text-white" 
                          : msg.role === 'bot'
                            ? "bg-cyan/10 text-navy border border-cyan/20"
                            : "bg-slate-100 text-navy"
                      )}>
                        <div className={cn(
                          "prose prose-sm max-w-none prose-p:leading-relaxed prose-img:rounded-sm prose-img:shadow-lg",
                          msg.role === 'user' ? "prose-invert" : "prose-slate"
                        )}>
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                        {msg.status === 'sending' && (
                          <div className="absolute -bottom-4 right-0 text-[8px] font-black uppercase tracking-widest text-slate-400 animate-pulse">
                            Sending...
                          </div>
                        )}
                        {msg.status === 'error' && (
                          <div className="absolute -bottom-4 right-0 text-[8px] font-black uppercase tracking-widest text-rose-500">
                            Failed to send
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {loading && isAiActive && (
                    <div className="flex justify-start">
                      <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-none flex items-center gap-3">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-cyan rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-1.5 h-1.5 bg-cyan rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-1.5 h-1.5 bg-cyan rounded-full animate-bounce"></span>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Beep Bot is thinking...</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              {chatStatus === 'closed' ? (
                <div className="p-6 bg-white rounded-sm border border-dashed border-slate-200 text-center">
                  <div className="w-10 h-10 bg-green-50 text-green-500 rounded-sm flex items-center justify-center mx-auto mb-3">
                    <CheckCircle size={20} />
                  </div>
                  <h4 className="text-xs font-black text-navy uppercase tracking-widest mb-1">Ticket Resolved</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    This conversation has been closed. Please start a new ticket if you need more help.
                  </p>
                  <button 
                    onClick={startNewChat}
                    className="mt-4 px-6 py-2 bg-cyan text-navy font-black rounded-sm text-[10px] uppercase tracking-widest hover:bg-cyan/90 transition-all"
                  >
                    START NEW TICKET
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSend} className="flex gap-3 items-end">
                  <div className="flex-grow relative">
                    <textarea 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Describe your issue or ask a question..."
                      className="w-full px-4 py-4 bg-white border border-slate-200 rounded-sm text-sm focus:ring-1 focus:ring-cyan outline-none resize-none min-h-[56px] max-h-[150px] pr-12"
                      rows={1}
                    />
                    <div className="absolute right-2 bottom-2 flex items-center gap-1">
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden" 
                        accept="image/*"
                      />
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="p-2 text-slate-400 hover:text-cyan transition-colors disabled:opacity-50"
                        title="Attach Screenshot"
                      >
                        {uploading ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={20} />}
                      </button>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={!input.trim() || loading || uploading}
                    className="w-14 h-14 bg-navy text-white rounded-sm flex items-center justify-center hover:bg-navy/90 transition-all shadow-none disabled:opacity-50 shrink-0"
                  >
                    <Send size={24} />
                  </button>
                </form>
              )}
              {chatStatus !== 'closed' && (
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-3 text-center">
                  Press Enter to send • Shift + Enter for new line
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

