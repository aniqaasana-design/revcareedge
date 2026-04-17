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
    const recipients = [process.env.CLIENT_EMAIL, process.env.ZOHO_EMAIL].filter(Boolean).join(', ');
    const clientMailOptions = {
      from: process.env.ZOHO_EMAIL,
      to: recipients,
      subject: 'New Audit Request',
      text: `New audit request:\n\nFull Name: ${fullName}\nPractice Name: ${practiceName}\nEmail: ${email}\nPhone: ${phone}\nMonthly Collections: ${monthlyCollections}`
    };

    const autoReplyOptions = {
      from: process.env.ZOHO_EMAIL,
      to: email,
      subject: 'We received your audit request',
      text: `Dear ${fullName},\n\nThank you for your interest in Rev Care Edge. We have received your request for a free audit and will contact you within 24 hours.\n\nBest regards,\nRev Care Edge Team`
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