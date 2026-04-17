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

    const { error } = await supabase
      .from('audit_requests')
      .insert({
        full_name: fullName,
        practice_name: practiceName,
        email,
        phone,
        monthly_collections: monthlyCollections
      });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    // Send email to both notification addresses
    const recipients = [process.env.CLIENT_EMAIL, process.env.ZOHO_EMAIL].filter(Boolean).join(', ');
    const clientMailOptions = {
      from: process.env.ZOHO_EMAIL,
      to: recipients,
      subject: 'New Audit Request',
      text: `New audit request:\n\nFull Name: ${fullName}\nPractice Name: ${practiceName}\nEmail: ${email}\nPhone: ${phone}\nMonthly Collections: ${monthlyCollections}`
    };

    try {
      await transporter.sendMail(clientMailOptions);
    } catch (emailErr) {
      console.error('Notification email error:', emailErr);
      return res.status(500).json({ error: 'Unable to send notification email' });
    }

    // Send auto-reply
    const autoReplyOptions = {
      from: process.env.ZOHO_EMAIL,
      to: email,
      subject: 'We received your audit request',
      text: `Dear ${fullName},\n\nThank you for your interest in Rev Care Edge. We have received your request for a free audit and will contact you within 24 hours.\n\nBest regards,\nRev Care Edge Team`
    };

    try {
      await transporter.sendMail(autoReplyOptions);
    } catch (replyErr) {
      console.error('Auto-reply email error; notification succeeded:', replyErr);
      // Do not fail the entire submission if the confirmation email cannot be delivered.
      return res.status(200).json({ success: true });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};