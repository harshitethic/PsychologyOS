"use client";

import { useEffect, useRef, useState } from "react";
import { Reply, Send } from "lucide-react";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  replyTo: { id: string; content: string; username: string } | null;
  user: { username: string; course: string | null; year: number | null };
};

type Person = {
  id: string;
  username: string;
  course: string | null;
  year: number | null;
  lastActiveAt: string | null;
};

// Deterministic timestamps avoid server/client timezone hydration mismatches.
export function CommunityClient({ initialMessages, initialPeople }: { initialMessages: Message[]; initialPeople: Person[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [people, setPeople] = useState(initialPeople);
  const [hydrated, setHydrated] = useState(false);
  const [secondsToReset, setSecondsToReset] = useState(24 * 60 * 60);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHydrated(true);
    bottom.current?.scrollIntoView({ behavior: "smooth" });

    const updateReset = () => {
      if (messages.length === 0) {
        setSecondsToReset(24 * 60 * 60);
        return;
      }
      const oldest = Math.min(...messages.map((m) => new Date(m.createdAt).getTime()));
      const remaining = Math.max(0, Math.ceil((oldest + 24 * 60 * 60 * 1000 - Date.now()) / 1000));
      setSecondsToReset(remaining);
    };

    updateReset();
    const timer = window.setInterval(updateReset, 1000);
    return () => window.clearInterval(timer);
  }, [messages]);

  useEffect(() => {
    const refresh = async () => {
      try {
        const r = await fetch("/api/community/people", { cache: "no-store" });
        if (r.ok) {
          const data = await r.json();
          setPeople(data.people || []);
        }
      } catch {}
    };

    void refresh();
    const timer = window.setInterval(() => { void refresh(); }, 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!hydrated || secondsToReset > 0) return;

    const refreshWindow = async () => {
      try {
        const r = await fetch("/api/community/messages", { cache: "no-store" });
        if (!r.ok) return;
        const data = await r.json();
        setMessages(data.messages || []);
      } catch {}
    };

    void refreshWindow();
  }, [hydrated, secondsToReset]);

  const formatCountdown = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  async function send() {
    const content = input.trim();
    if (!content || sending) return;
    setSending(true); setError("");

    try {
      const r = await fetch("/api/community/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, replyToId: replyTo?.id ?? null }),
      });
      const data = await r.json();

      if (!r.ok) {
        setError(data.error || "Could not send.");
        return;
      }

      setMessages(current => [
        ...current,
        {
          id: data.message.id,
          content: data.message.content,
          createdAt: data.message.createdAt,
          replyTo: replyTo ? { id: replyTo.id, content: replyTo.content, username: replyTo.user.username } : null,
          user: data.message.user,
        },
      ]);
      setInput("");
      setReplyTo(null);
    } catch {
      setError("Could not reach the community server.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="community-chat">
      <div className="community-reset-timer mobile-top-reset">
        <div>
          <span className="eyebrow">CHAT RESET</span>
          <strong>{secondsToReset === 0 ? "Refreshing chat…" : `${formatCountdown(secondsToReset)} left`}</strong>
        </div>
        <small>Messages disappear after 24 hours.</small>
      </div>

      <div className="community-messages">
        {messages.length === 0 ? (
          <div className="community-empty">
            <div className="eyebrow">BE THE FIRST</div>
            <h3>Ask something useful.</h3>
            <p>Coursework, study methods, exam prep, notes — keep it student-to-student.</p>
          </div>
        ) : messages.map(message => (
          <article className="community-message" key={message.id}>
            {message.replyTo && (
              <div className="community-reply-preview">
                Replying to <strong>@{message.replyTo.username}</strong>: {message.replyTo.content.slice(0, 90)}
              </div>
            )}
            <div className="community-message-head">
              <strong>@{message.user.username}</strong>
              {(message.user.course || message.user.year) && (
                <span>{message.user.course || "Student"}{message.user.year ? ` · Year ${message.user.year}` : ""}</span>
              )}
              <small>{new Date(message.createdAt).toISOString().slice(11, 16)}</small>
            </div>
            <p>{message.content}</p>
            <button className="reply-button" onClick={() => setReplyTo(message)}>
              <Reply size={13}/> Reply
            </button>
          </article>
        ))}
        <div ref={bottom}/>
      </div>

      <div className="community-live-people">
        {people.slice(0, 8).map(p => {
          const last = p.lastActiveAt ? new Date(p.lastActiveAt).getTime() : null;
          const diff = hydrated && last ? Math.max(0, Date.now() - last) : null;
          const active = diff !== null && diff < 5 * 60 * 1000;
          const hours = diff !== null ? Math.max(1, Math.floor(diff / 3600000)) : null;
          return <span key={p.id}>
            <i className="person-dot" data-active={active ? "true" : "false"}/>
            @{p.username} · {hydrated ? (active ? "online" : hours !== null ? `${hours}h ago` : "never") : "…"}
          </span>;
        })}
      </div>

      <div className="community-compose">
        {replyTo && (
          <div className="replying-bar">
            Replying to <strong>@{replyTo.user.username}</strong>
            <button onClick={() => setReplyTo(null)}>Cancel</button>
          </div>
        )}
        <div className="community-input">
          <textarea suppressHydrationWarning
            rows={2}
            maxLength={600}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="Say something to the group..."
          />
          <button className="send-button" onClick={() => void send()} disabled={sending || !input.trim()}>
            <Send size={16}/>
          </button>
        </div>
        {error && <p className="community-error">{error}</p>}
        <div className="community-compose-note">600 characters max · no links · be normal</div>
      </div>
    </div>
  );
}
