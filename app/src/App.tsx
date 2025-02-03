import React, { useState } from "react";
import axios from "axios";

const API_KEY = ""; // pUT THE aPI KEY HERE

const HUMANIZERS = [
  (text: string) => text.replace(/AI/g, "Artificial Intelligence"),
  (text: string) => text.replace(/Hello/g, "Hi there"),
  (text: string) => text.replace(/ChatGPT/g, "your AI assistant"),
  (text: string) => text.replace(/\bI'm\b/g, "I am"),
  (text: string) => text.replace(/okay/g, "alright"),
];

const REPHRASER = (text: string) => {
  return text
    // 🟢 Replace Formal Phrases with Casual Alternatives
    .replace(/\b(However|Nonetheless|Thus)\b/g, "That being said")
    .replace(/\b(In conclusion|To summarize|Ultimately)\b/g, "All things considered")
    .replace(/\b(For example|For instance)\b/g, "Just to illustrate")
    .replace(/\b(Therefore|Hence|So)\b/g, "Because of that")
    .replace(/\b(It is important to note that)\b/g, "A key thing to remember is that")
    .replace(/\b(As a result)\b/g, "Due to this fact")
    .replace(/\b(In other words)\b/g, "Put simply")
    .replace(/\b(Consequently)\b/g, "This led to")
    .replace(/\b(Specifically)\b/g, "To be more precise")
    .replace(/\b(Additionally|Moreover|Furthermore)\b/g, "On top of that")

    // 🔵 Transform Robotic Expressions into Natural Speech
    .replace(/\b(I believe that|It is my opinion that)\b/g, "I personally think")
    .replace(/\b(It is widely known that)\b/g, "Most people know that")
    .replace(/\b(It can be observed that)\b/g, "You can see that")
    .replace(/\b(A significant factor is)\b/g, "One big reason is")
    .replace(/\b(Due to the fact that)\b/g, "Since")
    .replace(/\b(Despite the fact that)\b/g, "Even though")
    .replace(/\b(At this point in time)\b/g, "Right now")
    .replace(/\b(A considerable amount of)\b/g, "A lot of")
    .replace(/\b(A wide range of)\b/g, "Many different")
    .replace(/\b(In the near future)\b/g, "Soon")
    .replace(/\b(With regard to|Regarding|Concerning)\b/g, "About")

    // 🔴 Reword AI-Generated "Filler" Phrases
    .replace(/\b(This paper will discuss|In this essay, I will)\b/g, "Let's talk about")
    .replace(/\b(This study aims to|This research focuses on)\b/g, "This is about")
    .replace(/\b(The purpose of this is to)\b/g, "This is meant to")
    .replace(/\b(It is evident that)\b/g, "Clearly")
    .replace(/\b(One must consider that)\b/g, "You should think about")
    .replace(/\b(The results indicate that)\b/g, "The findings show")
    .replace(/\b(It is interesting to note that)\b/g, "What's cool is")
    .replace(/\b(A noteworthy aspect is)\b/g, "Something worth mentioning is")

    // 🟡 Simplify Complex Sentence Structures
    .replace(/\b(Although it may seem that)\b/g, "Even though it looks like")
    .replace(/\b(Despite the challenges faced)\b/g, "Even with the difficulties")
    .replace(/\b(One could argue that)\b/g, "Some might say")
    .replace(/\b(It has been demonstrated that)\b/g, "Studies have shown")
    .replace(/\b(A potential drawback is)\b/g, "One downside is")
    .replace(/\b(It is often assumed that)\b/g, "People usually think")
    .replace(/\b(A common misconception is that)\b/g, "Many people wrongly believe")

    // 🟠 Reword Common AI-Generated Sentences
    .replace(/\b(The significance of this topic cannot be overstated)\b/g, "This topic is really important")
    .replace(/\b(A crucial element to consider is)\b/g, "Something really important is")
    .replace(/\b(The implications of this are far-reaching)\b/g, "This affects a lot of things")
    .replace(/\b(The benefits outweigh the drawbacks)\b/g, "The good parts are better than the bad parts")
    .replace(/\b(An important factor to keep in mind is)\b/g, "One thing you should remember is")
    .replace(/\b(It is undeniable that)\b/g, "There's no doubt that")

    // 🟣 Restructure Sentences for a More Human Feel
    .replace(/\b(X is not only Y, but also Z)\b/g, "X isn't just Y – it's also Z")
    .replace(/\b(It is often the case that)\b/g, "Most of the time")
    .replace(/\b(From a historical perspective)\b/g, "Looking at history")
    .replace(/\b(Research has consistently shown that)\b/g, "Studies keep proving that")
    .replace(/\b(An analysis of the data reveals that)\b/g, "Looking at the numbers, we see that")
    .replace(/\b(Considering all these aspects)\b/g, "Taking everything into account")

    // ⚫ Reword Statements That Sound AI-Generated
    .replace(/\b(The purpose of this discussion is to)\b/g, "What we're talking about here is")
    .replace(/\b(One of the main arguments is that)\b/g, "A big point here is that")
    .replace(/\b(This highlights the importance of)\b/g, "This shows why it's important to")
    .replace(/\b(Examining this issue reveals that)\b/g, "Looking into this issue, you’ll see that")
    .replace(/\b(A growing body of evidence suggests)\b/g, "More and more studies show that")

    // 🔥 Ensure Maximum Human-Like Rewriting
    .replace(/\b(While there are many perspectives on this issue, it is clear that)\b/g, "People see this differently, but it's obvious that")
    .replace(/\b(A comprehensive understanding of this topic requires)\b/g, "To really get this topic, you need to know")
    .replace(/\b(It is worth considering that)\b/g, "Something to think about is")
    .replace(/\b(This issue is not black and white)\b/g, "This isn't just a simple yes or no situation")
    .replace(/\b(There are many factors at play)\b/g, "A lot of things affect this")

    // 🟢 Add More Conversational Flow
    .replace(/\b(X is often associated with Y)\b/g, "People usually link X with Y")
    .replace(/\b(Are there any alternatives to this approach?)\b/g, "Is there another way to do this?")
    .replace(/\b(A logical conclusion to this argument is)\b/g, "So basically, what this means is")
    .replace(/\b(The logical next step is)\b/g, "The next obvious thing to do is")

    // 🟡 Last Human-Like Tweaks
    .replace(/\b(A point of contention is that)\b/g, "One thing people argue about is")
    .replace(/\b(While this is a valid concern)\b/g, "I see why that’s a concern, but")
    .replace(/\b(An alternative perspective is that)\b/g, "Another way to look at this is")
    .replace(/\b(This remains an area of debate)\b/g, "People still argue about this")
    .replace(/\b(In many ways, this is true)\b/g, "In a lot of ways, that's right");
};

const humanizeAndRephrase = (text: string) => {
  let humanized = HUMANIZERS.reduce((acc, fn) => fn(acc), text);
  return REPHRASER(humanized);
};

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (retryCount = 0) => {
    if (!input.trim() || retryCount > 3) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Add 2s delay to avoid rate limit

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: input }],
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const rawResponse = response.data.choices[0].message.content;
      const finalResponse = humanizeAndRephrase(rawResponse);

      setMessages([...messages, { user: input, bot: finalResponse }]);
      setInput("");
    } catch (error: any) {
      if (error.response?.status === 429 && retryCount < 3) {
        console.warn(`Rate limited, retrying in 5 seconds... (Attempt ${retryCount + 1}/3)`);
        setTimeout(() => sendMessage(retryCount + 1), 5000); // Retry after 5s
      } else {
        console.error("Error:", error);
        alert("Error sending message. Please wait and try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>Chat with AI</h1>
      <div style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <p><strong>You:</strong> {msg.user}</p>
            <p><strong>AI:</strong> {msg.bot}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "100%", padding: "10px", marginTop: "10px" }}
      />
      <button onClick={() => sendMessage()} disabled={loading} style={{ width: "100%", padding: "10px", marginTop: "10px" }}>
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
};

export default App;