import fetch from 'node-fetch';

// This function will run on the Appwrite server
export default async ({ req, res, log, error }) => {
 const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
 console.log("GEMINI_API_KEY",GEMINI_API_KEY);
  if (!GEMINI_API_KEY) {
    error("Gemini API key is not configured.");
    return res.json({ success: false, message: 'Server configuration error.' }, 500);
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ success: false, message: 'Message is required.' }, 400);
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
        }),
      }
    );

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

    return res.json({ success: true, data: aiResponse });

  } catch (err) {
    error("Error calling Gemini API: " + err.message);
    return res.json({ success: false, message: 'Failed to fetch AI response.' }, 500);
  }
};