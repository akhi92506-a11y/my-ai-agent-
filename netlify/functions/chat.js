exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body || '{}');
    if (!message || message.length > 2000)
      return { statusCode: 400, body: JSON.stringify({ error: 'মেসেজ ঠিক নেই' }) };
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] })
      }
    );
    const d = await r.json();
    const reply = d.candidates?.[0]?.content?.parts?.[0]?.text;
    return { statusCode: 200, body: JSON.stringify({ reply: reply || d.error?.message || 'উত্তর পাওয়া যায়নি' }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'সার্ভারে সমস্যা' }) };
  }
};
