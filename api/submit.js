const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.ZOHO_EMAIL || !process.env.ZOHO_APP_PASSWORD || !process.env.CLIENT_EMAIL) {
    console.error('Missing required environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  console.log('submit invoked', {
    url: process.env.SUPABASE_URL ? true : false,
    roleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? true : false,
    zohoEmail: process.env.ZOHO_EMAIL ? true : false,
    clientEmail: process.env.CLIENT_EMAIL ? true : false
  });

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_APP_PASSWORD
    }
  });

  try {
    const { fullName, practiceName, email, phone, collectionsRange, website } = req.body;
    console.log('request body', { fullName, practiceName, email, phone, collectionsRange, website });

    if (website) {
      return res.status(200).json({ success: true });
    }

    if (!fullName || fullName.length < 2) {
      return res.status(400).json({ error: 'Full name must be at least 2 characters' });
    }

    if (!practiceName || practiceName.length < 2) {
      return res.status(400).json({ error: 'Practice name must be at least 2 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    if (!phone || phone.length < 6) {
      return res.status(400).json({ error: 'Phone number must be at least 6 characters' });
    }

    if (collectionsRange === undefined || collectionsRange < 0 || collectionsRange > 5) {
      return res.status(400).json({ error: 'Invalid collections range' });
    }

    const collectionsMap = {
      0: '<$50k',
      1: '$50k',
      2: '$100k',
      3: '$500k',
      4: '$5M',
      5: '$10M+'
    };

    const monthlyCollections = collectionsMap[collectionsRange];

    // Prepare emails
    const host = req.headers.host || 'revcareedge.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const logoUrl = `${protocol}://${host}/logo.jpeg`;
    const siteUrl = `${protocol}://${host}`;

    const clientHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #0f172a; padding: 20px; text-align: center;">
          <img src="${logoUrl}" alt="Rev Care Edge" style="max-height: 50px; border-radius: 4px;" />
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #0f172a; margin-top: 0;">New Analysis Request</h2>
          <p style="font-size: 16px; color: #555;">You have received a new free practice analysis request from your website.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Full Name</td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${fullName}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Practice Name</td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${practiceName}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #0284c7;">${email}</a></td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${phone}</td></tr>
            <tr><td style="padding: 10px 0; font-weight: bold;">Monthly Collections</td><td style="padding: 10px 0;">${monthlyCollections}</td></tr>
          </table>
        </div>
        <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
          This email was sent automatically from the Rev Care Edge website.
        </div>
      </div>
    `;

    const autoReplyHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #0f172a; padding: 20px; text-align: center;">
          <img src="${logoUrl}" alt="Rev Care Edge" style="max-height: 50px; border-radius: 4px;" />
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #0f172a; margin-top: 0;">We received your analysis request!</h2>
          <p style="font-size: 16px; color: #555;">Dear <strong>${fullName}</strong>,</p>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">Thank you for your interest in Rev Care Edge and for taking the first step towards optimizing your practice's revenue cycle.</p>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">We have successfully received your request for a free practice analysis. One of our specialists will review your submission and contact you within <strong>24 hours</strong> using the details provided:</p>
          <ul style="color: #555; font-size: 15px; line-height: 1.6; background: #f8fafc; padding: 15px 15px 15px 35px; border-radius: 6px;">
            <li><strong>Practice:</strong> ${practiceName}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Email:</strong> ${email}</li>
          </ul>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">In the meantime, feel free to explore our <a href="${siteUrl}" style="color: #0284c7; text-decoration: none; font-weight: bold;">website</a> to learn more about our services.</p>
          <p style="font-size: 16px; color: #555; margin-top: 30px;">Best regards,<br><strong>The Rev Care Edge Team</strong></p>
        </div>
        <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
          &copy; ${new Date().getFullYear()} Rev Care Edge. All rights reserved.
        </div>
      </div>
    `;

    const recipients = [process.env.CLIENT_EMAIL, process.env.ZOHO_EMAIL].filter(Boolean).join(', ');
    const clientMailOptions = {
      from: process.env.ZOHO_EMAIL,
      to: recipients,
      subject: 'New Analysis Request',
      html: clientHtml
    };

    const autoReplyOptions = {
      from: process.env.ZOHO_EMAIL,
      to: email,
      subject: 'We received your analysis request - Rev Care Edge',
      html: autoReplyHtml
    };

    // Execute database insert and emails concurrently to avoid Vercel function timeout
    const dbPromise = supabase
      .from('audit_requests')
      .insert({
        full_name: fullName,
        practice_name: practiceName,
        email,
        phone,
        monthly_collections: monthlyCollections
      }).then(result => ({ type: 'db', result }));

    const notifyPromise = transporter.sendMail(clientMailOptions)
      .then(() => ({ type: 'notify', error: null }))
      .catch(err => ({ type: 'notify', error: err }));

    const replyPromise = transporter.sendMail(autoReplyOptions)
      .then(() => ({ type: 'reply', error: null }))
      .catch(err => {
        console.error('Auto-reply email error:', err);
        return { type: 'reply', error: err };
      });

    const results = await Promise.all([dbPromise, notifyPromise, replyPromise]);
    const dbRes = results[0].result;
    const notifyRes = results[1];

    if (dbRes.error) {
      console.error('Supabase error:', dbRes.error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (notifyRes.error) {
      console.error('Notification email error:', notifyRes.error);
      return res.status(500).json({ error: 'Unable to send notification email' });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};