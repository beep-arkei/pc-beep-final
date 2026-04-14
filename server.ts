import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
const PORT = 3000;

// Resend Setup (Optional, using nodemailer as primary for gmail relay)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Supabase Admin Client (Service Role Key)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("MISSING SUPABASE CONFIGURATION. Server may not function correctly.");
}

const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseServiceKey || "placeholder-key"
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 1. Send OTP Endpoint
app.post("/api/auth/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  try {
    // Save OTP to Supabase
    const { error } = await supabaseAdmin.from("otps").insert({
      email,
      code: otpCode,
      expires_at: expiresAt.toISOString(),
    });

    if (error) throw error;

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #0f172a;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #002B49; padding: 30px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase;">
              PC <span style="color: #00E5FF;">BEEP</span>
            </h1>
          </div>
          
          <div style="padding: 40px; text-align: center;">
            <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 800; color: #002B49; text-transform: uppercase; letter-spacing: -0.025em;">
              Verification Code
            </h2>
            <p style="margin: 0 0 32px 0; font-size: 14px; color: #64748b; font-weight: 500;">
              Use the code below to securely sign in to your PC Beep account.
            </p>
            
            <div style="background-color: #f1f5f9; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
              <div style="font-size: 48px; font-weight: 900; color: #00E5FF; letter-spacing: 0.2em; line-height: 1;">
                ${otpCode}
              </div>
            </div>
            
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
              This code expires in
            </p>
            <div style="display: inline-block; background-color: #fee2e2; color: #ef4444; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700;">
              10 MINUTES
            </div>
          </div>
          
          <div style="padding: 0 40px 40px 40px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 32px;">
            <p style="margin: 0 0 16px 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
              If you didn't request this code, you can safely ignore this email. Someone might have typed your email address by mistake.
            </p>
            <div style="font-size: 11px; color: #cbd5e1; font-weight: 500;">
              &copy; 2026 PC Beep. Bingag, Dauis, Bohol, Philippines.
            </div>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"PC Beep Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `[${otpCode}] Your PC Beep Verification Code`,
      text: `Your verification code is: ${otpCode}. It expires in 10 minutes.`,
      html: htmlContent,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Verify OTP Endpoint
app.post("/api/auth/verify-otp", async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: "Email and code are required" });

  try {
    const { data, error } = await supabaseAdmin
      .from("otps")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Delete OTP after use
    await supabaseAdmin.from("otps").delete().eq("id", data.id);

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Beep Bot Chat Endpoint (Stateful)
app.post("/api/chat", async (req, res) => {
  console.log("Chat request received:", req.body);
  const { message, chatId, userId } = req.body;
  if (!message || !userId) return res.status(400).json({ error: "Message and User ID are required" });

  try {
    let activeChatId = chatId;

    // 1. Get or Create Chat
    if (!activeChatId) {
      const { data: newChat, error: chatError } = await supabaseAdmin
        .from("chats")
        .insert({ user_id: userId })
        .select()
        .single();
      
      if (chatError) throw chatError;
      activeChatId = newChat.id;
    }

    // 2. Save User Message
    const { error: msgError } = await supabaseAdmin.from("chat_messages").insert({
      chat_id: activeChatId,
      sender_id: userId,
      role: "user",
      text: message
    });

    if (msgError) throw msgError;

    // 3. Check if AI should respond
    const { data: chat } = await supabaseAdmin
      .from("chats")
      .select("is_ai_active")
      .eq("id", activeChatId)
      .single();

    // Return chat state to frontend
    res.json({ 
      chatId: activeChatId, 
      isAiActive: chat?.is_ai_active ?? true 
    });
  } catch (error: any) {
    console.error("Error in chat:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Support Form Endpoint
app.post("/api/support/send", async (req, res) => {
  const { email, category, message } = req.body;
  if (!email || !category || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const timestamp = new Date().toLocaleString();
  const subject = `[SUPPORT] ${category}: New Message from ${email}`;
  
  // Quoted message for mailto link
  const quotedMessage = encodeURIComponent(`\n\n--- Original Message ---\nFrom: ${email}\nDate: ${timestamp}\nCategory: ${category}\n\n${message}`);
  const mailtoLink = `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}&body=${quotedMessage}`;

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #002B49; border-bottom: 2px solid #00E5FF; padding-bottom: 10px;">New Support Message</h2>
      <p><strong>From:</strong> ${email}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Timestamp:</strong> ${timestamp}</p>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
      <div style="text-align: center; margin-top: 30px;">
        <a href="${mailtoLink}" style="background: #00E5FF; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">QUICK REPLY</a>
      </div>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"PC Beep Support" <${process.env.EMAIL_USER}>`,
      to: "pcbeepph@gmail.com", // Send to itself
      replyTo: email,
      subject: subject,
      html: htmlContent,
    });

    res.json({ success: true, message: "Support message sent successfully" });
  } catch (error: any) {
    console.error("Error sending support email:", error);
    res.status(500).json({ error: error.message });
  }
});

// 5. Send Receipt Endpoint
app.post("/api/send-receipt", async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: "Order ID is required" });

  try {
    // Fetch order details with items and customer profile
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        profiles!orders_user_id_fkey(username, email:id),
        order_items(
          *,
          products(name)
        )
      `)
      .eq("id", orderId)
      .single();

    if (orderError || !order) throw new Error("Order not found");

    // Get customer email from auth
    const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.admin.getUserById(order.user_id);
    if (authError || !authUser) throw new Error("Customer email not found");
    
    const customerEmail = authUser.email;
    const itemsHtml = order.order_items.map((item: any) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
          <div style="font-weight: 700; color: #0f172a;">${item.products?.name || 'Product'}</div>
          <div style="font-size: 12px; color: #64748b;">Qty: ${item.quantity}</div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 700; color: #0f172a;">
          ₱${(item.price_at_purchase * item.quantity).toLocaleString()}
        </td>
      </tr>
    `).join("");

    const htmlContent = `
      <div style="font-family: 'Inter', sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #0f172a;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #002B49; padding: 40px; text-align: center;">
            <div style="font-size: 28px; font-weight: 900; color: #ffffff; letter-spacing: -0.05em; text-transform: uppercase; margin-bottom: 8px;">
              PC <span style="color: #00E5FF;">BEEP</span>
            </div>
            <div style="color: #00E5FF; font-size: 12px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase;">
              Official E-Receipt
            </div>
          </div>
          
          <div style="padding: 40px;">
            <div style="display: flex; justify-content: justify; margin-bottom: 32px;">
              <div>
                <div style="font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Order ID</div>
                <div style="font-family: monospace; font-size: 14px; font-weight: 700; color: #0f172a;">#${order.id.slice(0, 8).toUpperCase()}</div>
              </div>
              <div style="text-align: right; margin-left: auto;">
                <div style="font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Date Paid</div>
                <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${new Date(order.payment_verified_at).toLocaleDateString()}</div>
              </div>
            </div>

            <div style="background-color: #f1f5f9; border-radius: 16px; padding: 20px; margin-bottom: 32px;">
              <div style="font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Shipping To</div>
              <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">${order.profiles?.username}</div>
              <div style="font-size: 13px; color: #475569; line-height: 1.5;">${order.shipping_address || 'No address provided'}</div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
              <thead>
                <tr>
                  <th style="text-align: left; font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 12px; border-bottom: 2px solid #f1f5f9;">Item</th>
                  <th style="text-align: right; font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 12px; border-bottom: 2px solid #f1f5f9;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="border-top: 2px solid #f1f5f9; padding-top: 20px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <div style="font-size: 14px; color: #64748b;">Subtotal</div>
                <div style="font-size: 14px; font-weight: 600; color: #0f172a;">₱${(order.total_amount - (order.shipping_fee || 0)).toLocaleString()}</div>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <div style="font-size: 14px; color: #64748b;">Shipping Fee</div>
                <div style="font-size: 14px; font-weight: 600; color: #0f172a;">₱${(order.shipping_fee || 0).toLocaleString()}</div>
              </div>
              <div style="display: flex; justify-content: space-between; background-color: #002B49; border-radius: 12px; padding: 16px; color: #ffffff;">
                <div style="font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Total Paid</div>
                <div style="font-size: 20px; font-weight: 900; color: #00E5FF;">₱${order.total_amount.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          <div style="padding: 32px 40px; background-color: #f8fafc; text-align: center; border-top: 1px solid #f1f5f9;">
            <p style="margin: 0 0 16px 0; font-size: 13px; color: #64748b; line-height: 1.5;">
              Thank you for choosing PC Beep! Your order is now being processed for packing. You will receive another notification once it has been handed over to our courier.
            </p>
            <div style="font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">
              &copy; 2026 PC Beep &bull; Dauis, Bohol
            </div>
          </div>
        </div>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"PC Beep Orders" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `E-Receipt for Order #${order.id.slice(0, 8).toUpperCase()}`,
      html: htmlContent,
    });

    res.json({ success: true, message: "Receipt sent successfully" });
  } catch (error: any) {
    console.error("Error sending receipt:", error);
    res.status(500).json({ error: error.message });
  }
});

// 6. Submit Refund Request (Bypasses RLS for users)
app.post("/api/refunds/submit", async (req, res) => {
  const { orderId, reason, explanation, evidenceUrls } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
  const token = authHeader.split(" ")[1];

  try {
    // 1. Verify user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    // 2. Create refund request using Admin Client (bypasses RLS)
    const { error: refundError } = await supabaseAdmin
      .from('refunds')
      .insert({
        order_id: orderId,
        user_id: user.id,
        reason_code: reason,
        explanation,
        evidence_urls: evidenceUrls,
        status: 'pending'
      });

    if (refundError) {
      if (refundError.code === '23505') {
        return res.status(400).json({ error: 'A refund request already exists for this order.' });
      }
      throw refundError;
    }

    // 3. Update order status
    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .update({ status: 'refund_requested' })
      .eq('id', orderId);

    if (orderError) throw orderError;

    res.json({ success: true });
  } catch (error: any) {
    console.error("Error submitting refund via API:", error);
    res.status(500).json({ error: error.message });
  }
});

// 7. Dev Seed Accounts Endpoint (Admin only logic)
app.post("/api/dev/seed-accounts", async (req, res) => {
  const accounts = [
    { email: 'ryankaitobeppu@gmail.com', password: 'beep123', username: 'Owner', role: 'owner' },
    { email: 'rkbeppu@gmail.com', password: 'admin123', username: 'Admin', role: 'admin' },
    { email: 'rkpbeppu@universityofbohol.edu.ph', password: '123456', username: 'User', role: 'buyer' }
  ];

  const results = [];

  try {
    for (const acc of accounts) {
      // Check if user exists by email
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw listError;

      let user = (users as any[]).find(u => u.email === acc.email);

      if (!user) {
        // Create user with confirmed email
        const { data: { user: newUser }, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: acc.email,
          password: acc.password,
          email_confirm: true,
          user_metadata: { username: acc.username, role: acc.role }
        });
        if (createError) {
          results.push({ email: acc.email, status: 'error', message: createError.message });
          continue;
        }
        user = newUser;
      } else {
        // Update existing user metadata if needed
        await supabaseAdmin.auth.admin.updateUserById(user.id, { 
          user_metadata: { username: acc.username, role: acc.role },
          email_confirm: true 
        });
      }

      if (user) {
        // Upsert profile with correct role
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: user.id,
            username: acc.username,
            role: acc.role,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (profileError) {
          results.push({ email: acc.email, status: 'error', message: `Profile error: ${profileError.message}` });
        } else {
          results.push({ email: acc.email, status: 'success' });
        }
      }
    }

    res.json({ success: true, results });
  } catch (error: any) {
    console.error("Error in dev seeding:", error);
    res.status(500).json({ error: error.message });
  }
});

// 6. Employee Management (Owner Only)
// Middleware to check if the requester is an owner
const isOwner = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) return res.status(401).json({ error: "Unauthorized" });

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "owner") {
    return res.status(403).json({ error: "Forbidden: Owner access required" });
  }

  req.user = user;
  next();
};

app.get("/api/owner/employees", isOwner, async (req, res) => {
  try {
    // Fetch all admins
    const { data: admins, error: adminsError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("role", "admin");

    if (adminsError) throw adminsError;

    // Fetch all users from auth to get emails
    const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) throw authError;

    // Fetch sales stats per admin
    // We'll calculate this from orders table where fulfilled_by = admin.id
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select("total_amount, fulfilled_by")
      .in("status", ["delivered", "completed"]);

    if (ordersError) throw ordersError;

    const employees = (admins || []).map(admin => {
      const authUser = (users || []).find((u: any) => u.id === admin.id);
      const totalSales = (orders || [])
        .filter((o: any) => o.fulfilled_by === admin.id)
        .reduce((sum: number, o: any) => sum + Number(o.total_amount), 0);

      return {
        ...admin,
        email: authUser?.email,
        totalSales
      };
    });

    res.json(employees);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/owner/employees", isOwner, async (req, res) => {
  const { email, password, username, bio } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ error: "Email, password, and username are required" });
  }

  try {
    const { data: { user }, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username }
    });

    if (createError) throw createError;

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: user.id,
        username,
        role: "admin",
        bio
      });

    if (profileError) throw profileError;

    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/owner/employees/:id", isOwner, async (req, res) => {
  const { id } = req.params;
  const { email, password, username, bio } = req.body;

  try {
    const updateData: any = {};
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    if (username) updateData.user_metadata = { ...updateData.user_metadata, username };

    if (Object.keys(updateData).length > 0) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, updateData);
      if (authError) throw authError;
    }

    const profileUpdate: any = {};
    if (username) profileUpdate.username = username;
    if (bio !== undefined) profileUpdate.bio = bio;

    if (Object.keys(profileUpdate).length > 0) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update(profileUpdate)
        .eq("id", id);
      if (profileError) throw profileError;
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/owner/employees/:id", isOwner, async (req, res) => {
  const { id } = req.params;
  try {
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (authError) throw authError;

    // Profile will be deleted automatically due to CASCADE in schema
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
