const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.generateTaskDescription = async (req, res) => {
    try {
        const { title, context } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key') {
            return res.status(503).json({ error: 'Gemini API Key is not configured correctly on the server.' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        let prompt = `Write a comprehensive and professional task description for a task titled: "${title}".`;
        if (context) {
            prompt += ` Additional context: ${context}.`;
        }

        prompt += ` Keep it concise, action-oriented, and well-structured.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ description: text });
    } catch (error) {
        console.error('Generative AI Error:', error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
};
