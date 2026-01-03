const admin = require('firebase-admin');

// Initialize Firebase Admin (Same logic as above)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    }),
  });
}

const db = admin.firestore();

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, otp } = JSON.parse(event.body);

    const docRef = db.collection('otp_requests').doc(email);
    const doc = await docRef.get();

    if (!doc.exists) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No OTP request found' }) };
    }

    const data = doc.data();
    const now = Date.now();

    // Check Expiration
    if (now > data.expiresAt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'OTP has expired' }) };
    }

    // Check Match
    if (data.otp === otp) {
      // Success! Delete the OTP so it can't be used again
      await docRef.delete();
      
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Verification Successful', verified: true }),
      };
    } else {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid Code' }) };
    }

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Verification failed' }),
    };
  }
};