"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Trash2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string; createdAt?: string };

const starters = [
  "Explain this like I'm starting from zero.",
  "Give me a real-life example.",
  "Quiz me with 5 questions.",
  "What would an examiner ask here?",
];

export function AITutorChat({
  topic,
  initial,
}: {
  topic: string;
  initial: Msg[];
}) {
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text = input) {
    const question = text.trim();
    if (!question || loading) return;

    const next = [...messages, { role: "user" as const, content: question }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, question, history: next }),
      });

      const data = await response.json();

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.answer || data.error || "The tutor did not return an answer.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "The local tutor is offline. Start Ollama and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
  }

  return (
    <div className="chatgpt-shell">
      <div className="chatgpt-topbar">
        <div>
          <div className="eyebrow">LOCAL AI TUTOR</div>
          <div className="chatgpt-topic">
            {topic.replaceAll("-", " ")}
          </div>
        </div>
        <div className="chatgpt-actions">
          <span className="pill">7-day memory</span>
          <button className="icon-button" title="Clear this chat" onClick={clearChat}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="chatgpt-body">
        {messages.length === 0 ? (
          <div className="chatgpt-welcome">
            <div className="ai-orb"><Sparkles size={24} /></div>
            <div className="eyebrow">PSYCHOLOGY OS TUTOR</div>
            <h2>What are you stuck on?</h2>
            <p>
              Ask naturally. You can ask for simpler explanations, examples,
              comparisons, exam questions, or a quiz.
            </p>
            <div className="starter-grid">
              {starters.map((starter) => (
                <button key={starter} className="starter-card" onClick={() => void send(starter)}>
                  {starter}<span>→</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-thread">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chat-row ${message.role}`}>
                <div className="chat-avatar">
                  {message.role === "user" ? "Y" : "ψ"}
                </div>
                <div className="chat-message-content">
                  <div className="chat-name">{message.role === "user" ? "You" : "Psychology OS"}</div>
                  <div className="chat-message">{message.content}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-row assistant">
                <div className="chat-avatar">ψ</div>
                <div className="chat-message-content">
                  <div className="chat-name">Psychology OS</div>
                  <div className="chat-message">
                    <span className="typing-dots"><i/><i/><i/></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottom} />
          </div>
        )}
      </div>

      <div className="chatgpt-composer-wrap">
        <div className="chatgpt-composer">
          <textarea
            rows={1}
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="Message your psychology tutor..."
          />
          <button
            className="send-button"
            disabled={loading || !input.trim()}
            onClick={() => void send()}
          >
            <Send size={16} />
          </button>
        </div>
        <p>Local model · no paid API · conversation retained for 7 days</p>
      </div>
    </div>
  );
}
