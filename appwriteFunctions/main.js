import fetch from 'node-fetch';

// This function will run on the Appwrite server
export default async ({ req, res, log, error }) => {
  // Extract environment variable specifically during function execution
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
  
  if (!GEMINI_API_KEY) {
    error("Gemini API key is not configured.");
    return res.json({ success: false, question: 'Server configuration error.' }, 500);
  }

  try {
    // Appwrite sends body as an object or a string depending on how it was triggered
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        log("Body was not valid JSON string.");
      }
    }

    const question = payload.question;

    if (!question) {
      return res.json({ success: false, message: 'question is required.' }, 400);
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: question }] }],
        }),
      }
    );

    const data = await response.json();
    log("Gemini API Full Response:");
    log(JSON.stringify(data));
    
    // Add specific error checking to help debug from Appwrite console
    if (data.error) {
      error(`Gemini Data Error: ${JSON.stringify(data.error)}`);
    }

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

    return res.json({ success: true, data: aiResponse });

  } catch (err) {
    error("Error calling Gemini API: " + err.question);
    return res.json({ success: false, question: 'Failed to fetch AI response.' }, 500);
  }
};
