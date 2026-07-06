import { env } from '@/config/env';

export const geminiService = {
  async generateResponse(systemPrompt: string, userMessage: string, history: { role: string; content: string }[]): Promise<string> {
    const apiKey = env.geminiApiKey;
    if (!apiKey) {
      throw new Error('Gemini API key is missing.');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const formattedHistory = history.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Append the current user request with tool contexts injected
    formattedHistory.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: formattedHistory,
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      throw new Error('Invalid response structure received from Gemini API.');
    }

    return replyText;
  },

  async streamResponse(
    systemPrompt: string,
    userMessage: string,
    history: { role: string; content: string }[],
    onChunk: (text: string) => void
  ): Promise<string> {
    const apiKey = env.geminiApiKey;
    if (!apiKey) {
      throw new Error('Gemini API key is missing.');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${apiKey}`;

    const formattedHistory = history.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    formattedHistory.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: formattedHistory,
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini streaming request failed with status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';

    if (!reader) {
      throw new Error('Stream reader not available on response body.');
    }

    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // The response is a series of JSON objects, sometimes wrapped in a JSON array.
      // We parse the chunks as they complete.
      try {
        // Find matching boundaries of JSON objects in the stream buffer
        let startIdx = buffer.indexOf('{');
        while (startIdx !== -1) {
          let braceCount = 0;
          let endIdx = -1;

          for (let i = startIdx; i < buffer.length; i++) {
            if (buffer[i] === '{') braceCount++;
            if (buffer[i] === '}') {
              braceCount--;
              if (braceCount === 0) {
                endIdx = i;
                break;
              }
            }
          }

          if (endIdx !== -1) {
            const jsonStr = buffer.substring(startIdx, endIdx + 1);
            buffer = buffer.substring(endIdx + 1);

            const jsonObj = JSON.parse(jsonStr);
            const chunkText = jsonObj?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (chunkText) {
              fullText += chunkText;
              onChunk(chunkText);
            }
            startIdx = buffer.indexOf('{');
          } else {
            break;
          }
        }
      } catch (err) {
        // Wait for more chunks to resolve JSON boundaries
      }
    }

    return fullText;
  },
};
export default geminiService;
