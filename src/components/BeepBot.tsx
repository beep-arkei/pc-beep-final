import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, User, Maximize2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { generateAiResponse } from '../services/geminiService';
import { uploadChatAttachment } from '../lib/storage';
import { BeepBotMascot } from './BeepBotMascot';

interface Message {
  role: 'user' | 'bot' | 'admin';
  text: string;
  created_at?: string;
  status?: 'sending' | 'sent' | 'error';
}

export const BeepBot: React.FC = () => {
  const { user } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState<string | null>(localStorage.getItem('beep_chat_id'));
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hello! I am Beep Bot. How can I help you build your dream PC today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [isAiActive, setIsAiActive] = useState(true);
  const [chatStatus, setChatStatus] = useState('active');
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load existing messages and subscribe to updates
  useEffect(() => {
    if (!chatId || !isOpen) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('role, text, created_at')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data as Message[]);
      }

      // Check AI status
      const { data: chat } = await supabase
        .from('chats')
        .select('is_ai_active, status')
        .eq('id', chatId)
        .single();
      
      if (chat) {
        setIsAiActive(chat.is_ai_active);
        setChatStatus(chat.status);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chat_messages',
        filter: `chat_id=eq.${chatId}`
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prev => {
          // If we have an optimistic message for this, replace it with the real one
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

          if (prev.some(m => m.created_at === newMessage.created_at && m.text === newMessage.text)) {
            return prev;
          }
          return [...prev, newMessage];
        });
        // Auto-scroll on new message
        setTimeout(scrollToBottom, 100);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chats',
        filter: `id=eq.${chatId}`
      }, (payload) => {
        setIsAiActive(payload.new.is_ai_active);
        setChatStatus(payload.new.status);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, isOpen]);

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault();
    const textToSend = customText || input.trim();
    if (!textToSend || loading || !user) return;

    if (!customText) setInput('');
    
    // Optimistic update
    const tempId = Math.random().toString(36).substring(7);
    const optimisticMessage: Message = { 
      role: 'user', 
      text: textToSend, 
      status: 'sending',
      created_at: new Date().toISOString() 
    };
    
    setMessages(prev => [...prev, optimisticMessage]);
    setLoading(true);

    try {
      // 1. Save message to backend and get chat state
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend,
          chatId,
          userId: user.id
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send message');

      const activeChatId = data.chatId;
      if (activeChatId && !chatId) {
        setChatId(activeChatId);
        localStorage.setItem('beep_chat_id', activeChatId);
      }

      // Update optimistic message to 'sent'
      setMessages(prev => prev.map(m => 
        (m.text === textToSend && m.status === 'sending') ? { ...m, status: 'sent' } : m
      ));

      // 2. If AI is active, call Gemini on frontend
      if (data.isAiActive) {
        const history = [...messages, optimisticMessage];
        const botText = await generateAiResponse(textToSend, history);

        if (botText) {
          // 3. Save AI response to Supabase
          await supabase.from('chat_messages').insert({
            chat_id: activeChatId,
            role: 'bot',
            text: botText
          });
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => prev.map(m => 
        (m.text === textToSend && m.status === 'sending') ? { ...m, status: 'error' } : m
      ));
      toast.error('Failed to send message');
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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-sm shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-navy p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-sm flex items-center justify-center shadow-none overflow-hidden border border-slate-800">
                  {isAiActive ? (
                    <BeepBotMascot variant="minimal" size={40} className="scale-150" />
                  ) : (
                    <User className="text-cyan" size={20} />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-tighter">
                    {isAiActive ? 'Beep Bot' : 'Human Support'}
                  </h3>
                  <p className="text-cyan text-[10px] font-bold uppercase tracking-widest">
                    {isAiActive ? 'Online Assistant' : 'Live Agent'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link 
                  to="/support" 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                  title="Go Fullscreen"
                >
                  <Maximize2 size={16} />
                </Link>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-sm text-sm relative ${
                    msg.role === 'user' 
                      ? 'bg-cyan text-navy' 
                      : 'bg-white text-navy border border-slate-200 shadow-none'
                  }`}>
                    <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-code:text-cyan prose-strong:text-inherit">
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
                </div>
              ))}
              {loading && isAiActive && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-sm border border-slate-200 shadow-none flex items-center gap-3">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-cyan rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-cyan rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-cyan rounded-full animate-bounce"></span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Beep Bot is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              {chatStatus === 'closed' ? (
                <div className="text-center py-2">
                  <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2">Ticket Resolved</p>
                  <button 
                    onClick={() => {
                      setChatId(null);
                      localStorage.removeItem('beep_chat_id');
                      setMessages([{ role: 'bot', text: 'Hello! I am Beep Bot. How can I help you build your dream PC today?' }]);
                      setChatStatus('active');
                    }}
                    className="text-[10px] font-black text-navy hover:text-cyan uppercase tracking-widest underline decoration-2 underline-offset-4 transition-colors"
                  >
                    Start New Conversation
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSend} className="flex gap-2 items-center">
                  <div className="flex-grow relative">
                    <input 
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={user ? "Ask me anything..." : "Please login to chat"}
                      disabled={!user}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-sm focus:ring-1 focus:ring-cyan outline-none text-sm disabled:opacity-50 pr-10"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
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
                        disabled={uploading || !user}
                        className="p-1 text-slate-400 hover:text-cyan transition-colors disabled:opacity-50"
                      >
                        {uploading ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />}
                      </button>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={!input.trim() || loading || uploading || !user}
                    className="w-10 h-10 bg-navy text-white rounded-sm flex items-center justify-center hover:bg-navy/90 transition-all disabled:opacity-50 shrink-0"
                  >
                    <Send size={18} />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 z-50 group overflow-hidden",
          isOpen 
            ? 'bg-white text-navy rotate-90 shadow-[0_0_30px_rgba(0,229,255,0.5)]' 
            : 'bg-navy text-white shadow-[0_0_40px_rgba(0,43,73,0.4)]'
        )}
      >
        {/* Animated background glow */}
        {!isOpen && (
          <div className="absolute inset-0 bg-gradient-to-br from-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
        
        {/* Shine effect */}
        {!isOpen && (
          <div className="absolute -inset-full top-0 block w-1/2 h-full z-5 bg-gradient-to-r from-transparent to-white/10 skew-x-[-25deg] group-hover:animate-shine" />
        )}

        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {isOpen ? <X size={28} /> : (
            <div className="relative w-full h-full flex items-center justify-center">
              <BeepBotMascot variant="minimal" size={64} className="scale-125" />
              <div className="absolute top-3 right-3 w-3 h-3 bg-cyan rounded-full border-2 border-navy animate-pulse" />
            </div>
          )}
        </div>
      </button>
    </div>
  );
};
