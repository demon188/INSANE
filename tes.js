const fetch = require("node-fetch");

const OPENROUTER_KEY = "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"; // 🔐 You should rotate or keep this secret

async function askJarvisOpenRouter(prompt) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://yourdomain.com", // optional but may be required by OpenRouter
        "X-Title": "PantherBot", // optional, helps identify your app
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "user", content: `Reply in 25 characters or less: ${prompt}` },
        ],
        max_tokens: 50,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // Handle errors
    if (data.error) {
      console.error("❌ OpenRouter Error:", data.error.message);
      return "API error occurred.";
    }

    const reply = data.choices?.[0]?.message?.content?.trim();
    return reply || "No reply.";
  } catch (err) {
    console.error("❌ Fetch Error:", err.message);
    return "Network error.";
  }
}

// Test it:
askJarvisOpenRouter("Who are you?").then(console.log);
