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

    // Honeypot check
    if (website) {
      return res.status(200).json({ success: true });
    }

    if (!fullName || fullName.length < 2) {
      return res.status(400).json({ error: 'Full name must be at least 2 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    if (!phone || phone.length < 6) {
      return res.status(400).json({ error: 'Phone number must be at least 6 characters' });
    }

    // Process optional/removed fields (Priority 1 & 2)
    const finalPracticeName = practiceName || 'Not Provided';
    let monthlyCollections = 'Not Provided';

    if (collectionsRange !== undefined && collectionsRange !== null) {
      const collectionsMap = {
        0: '<$50k',
        1: '$50k',
        2: '$100k',
        3: '$500k',
        4: '$5M',
        5: '$10M+'
      };
      monthlyCollections = collectionsMap[collectionsRange] || null;
    }

    // Prepare emails
    const host = req.headers.host || 'revcareedge.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const logoUrl = `${protocol}://${host}/logo.jpeg`;
    const siteUrl = `${protocol}://${host}`;

    const clientHtml = `
      <div style="background-color: #f4f7f6; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          <!-- Header -->
          <div style="background: #0f172a; padding: 30px 20px; text-align: center; border-bottom: 4px solid #F5872E;">
            <img src="${logoUrl}" alt="Rev Care Edge" style="max-height: 45px; margin-bottom: 0;" />
          </div>
          
          <!-- Body -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #101828; margin-top: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">New Analysis Request 🚀</h2>
            <p style="font-size: 16px; color: #475467; line-height: 1.6; margin-bottom: 30px;">
              Great news! A new prospective client has requested a free practice analysis through the website.
            </p>
            
            <!-- Data Container -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
              <div style="margin-bottom: 16px;">
                <span style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600; margin-bottom: 4px;">Full Name</span>
                <span style="display: block; font-size: 16px; color: #0f172a; font-weight: 500;">${fullName}</span>
              </div>
              <div style="margin-bottom: 16px;">
                <span style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600; margin-bottom: 4px;">Email Address</span>
                <a href="mailto:${email}" style="display: inline-block; font-size: 16px; color: #0284c7; text-decoration: none; font-weight: 500;">${email}</a>
              </div>
              <div>
                <span style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600; margin-bottom: 4px;">Phone Number</span>
                <a href="tel:${phone}" style="display: inline-block; font-size: 16px; color: #0f172a; text-decoration: none; font-weight: 500;">${phone}</a>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 13px; color: #64748b;">
              This is an automated notification from the <strong>Rev Care Edge</strong> website.
            </p>
          </div>
        </div>
      </div>
    `;

    const autoReplyHtml = `
      <div style="background-color: #f4f7f6; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          <!-- Header -->
          <div style="background: #0f172a; padding: 30px 20px; text-align: center; border-bottom: 4px solid #3E7B4F;">
            <img src="${logoUrl}" alt="Rev Care Edge" style="max-height: 45px; margin-bottom: 0;" />
          </div>
          
          <!-- Body -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #101828; margin-top: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">We're on it!</h2>
            <p style="font-size: 16px; color: #475467; line-height: 1.6; margin-bottom: 20px;">
              Hi <strong>${fullName.split(' ')[0]}</strong>,
            </p>
            <p style="font-size: 16px; color: #475467; line-height: 1.6; margin-bottom: 25px;">
              Thank you for reaching out to <strong>Rev Care Edge</strong>. We have successfully received your request for a free billing analysis!
            </p>
            
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
              <p style="margin: 0; font-size: 15px; color: #166534; line-height: 1.6; font-weight: 500;">
                <span style="font-size: 18px; margin-right: 5px;">📞</span> One of our revenue cycle experts will review your details and contact you within <strong>24 hours</strong>.
              </p>
            </div>
            
            <p style="font-size: 16px; color: #475467; line-height: 1.6; margin-bottom: 30px;">
              In the meantime, feel free to explore our <a href="${siteUrl}" style="color: #3E7B4F; text-decoration: none; font-weight: 600;">services</a> to learn more about how we identify hidden revenue opportunities.
            </p>
            
            <p style="font-size: 16px; color: #101828; line-height: 1.6; margin-top: 0; font-weight: 600;">
              Best regards,<br>
              <span style="color: #475467; font-weight: 400;">The Rev Care Edge Team</span>
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 13px; color: #64748b;">
              &copy; ${new Date().getFullYear()} Rev Care Edge. All rights reserved.
            </p>
          </div>
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
        practice_name: finalPracticeName,
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
