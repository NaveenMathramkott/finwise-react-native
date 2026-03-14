import fetch from 'node-fetch';

// This function will run on the Appwrite server
export default async ({ req, res, log, error }) => {
  // Extract environment variable specifically during function execution
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; 
  
  if (!OPENROUTER_API_KEY) {
    error("OpenRouter API key is not configured.");
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
      `https://openrouter.ai/api/v1/chat/completions`,
      {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://finwise.com', // Required by OpenRouter for ranking
          'X-Title': 'FinWise'
        },
        body: JSON.stringify({
          model: 'qwen/qwen3-coder:free', // Using the free Qwen Coder model
          messages: [
            {
              role: 'system',
              content: 'You are a helpful, concise financial assistant for the FinWise app.'
            },
            {
              role: 'user',
              content: question
            }
          ]
        }),
      }
    );

    const data = await response.json();
    log("OpenRouter API Full Response:");
    log(JSON.stringify(data));
    
    // Add specific error checking to help debug from Appwrite console
    if (data.error) {
      error(`OpenRouter Data Error: ${JSON.stringify(data.error)}`);
    }

    const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    return res.json({ success: true, data: aiResponse });

  } catch (err) {
    error("Error calling OpenRouter API: " + (err.message || err));
    return res.json({ success: false, message: 'Failed to fetch AI response.' }, 500);
  }
};
