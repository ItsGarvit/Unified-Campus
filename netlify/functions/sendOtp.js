const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

// Initialize Firebase Admin (Backend SDK)
// This checks if the app is already initialized to prevent errors on re-renders
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace newline characters which can get mangled in Netlify Env Vars
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    }),
  });
}

const db = admin.firestore();

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email is required' }) };
    }

    // 1. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // Expires in 5 minutes

    // 2. Store in Firestore 'otp_requests' collection
    // We use the email as the document ID so one user can't spam multiple codes
    await db.collection('otp_requests').doc(email).set({
      otp: otp,
      expiresAt: expiresAt,
      verified: false
    });

    // 3. Configure Email Transporter (Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS
      }
    });

    // 4. Send Email
    await transporter.sendMail({
      from: '"Unified Campus" <' + process.env.EMAIL_USER + '>',
      to: email,
      subject: 'Unified Campus Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h2>Verify Your Email</h2>
          <p>Your 6-digit code is:</p>
          <h1 style="color: #4A90E2; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p style="color: #666; font-size: 12px;">This code expires in 5 minutes.</p>
        </div>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'OTP sent successfully' }),
    };

  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};