import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

/* ─── Stream helper ─────────────────────────────────────────── */
async function streamChat(messages, onChunk, onDone, onError) {
  let response;
  try {
    response = await fetch("/api/ai/chat", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ messages }),
    });
  } catch {
    onError("Could not reach the server. Is it running?");
    return;
  }

  if (!response.ok) {
    onError("AI service is unavailable right now.");
    return;
  }

  const reader  = response.body.getReader();
  const decoder = new TextDecoder();
  let   buffer  = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop(); // keep incomplete tail

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (payload === "[DONE]") { onDone(); return; }
      try {
        const { content, error } = JSON.parse(payload);
        if (error) { onError(error); return; }
        if (content) onChunk(content);
      } catch { /* skip malformed chunk */ }
    }
  }
  onDone();
}

/* ─── Suggestion chips shown on empty state ─────────────────── */
const SUGGESTIONS = [
  "What services do you offer?",
  "How much does the Business plan cost?",
  "How can I grow on TikTok?",
  "What makes REVOLVER different?",
];

/* ─── Icons ─────────────────────────────────────────────────── */
const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ─── Typing dots ────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#e85d04]/60"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1, delay: i * 0.18, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

/* ─── Single message bubble ─────────────────────────────────── */
function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#e85d04]/10 border border-[#e85d04]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[82%] rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-[#e85d04] text-white rounded-tr-sm px-4 py-2.5"
            : "bg-white/6 border border-white/8 text-white/85 rounded-tl-sm px-4 py-2.5"
        }`}
      >
        {msg.content}
        {msg.streaming && (
          <motion.span
            className="inline-block w-0.5 h-3.5 bg-current ml-0.5 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main chat widget ───────────────────────────────────────── */
export default function AIChat() {
  const location = useLocation();
  const [open,     setOpen]     = useState(false);
  const [input,    setInput]    = useState("");
  const [messages, setMessages] = useState([]);
  const [busy,     setBusy]     = useState(false);
  const [hasNew,   setHasNew]   = useState(false);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  // Hide on admin pages
  const isAdmin = location.pathname.startsWith("/revolver-studio");
  if (isAdmin) return null;

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const handleOpen = () => { setOpen(true); setHasNew(false); };

  const sendMessage = useCallback(async (text) => {
    const userText = text.trim();
    if (!userText || busy) return;

    setInput("");
    setBusy(true);

    const userMsg  = { role: "user",      content: userText };
    const history  = [...messages, userMsg];

    setMessages((prev) => [...prev, userMsg]);

    // Add empty streaming assistant message
    const assistantId = Date.now();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "", streaming: true }]);

    // Build messages for API (only role + content)
    const apiMessages = history.map(({ role, content }) => ({ role, content }));

    await streamChat(
      apiMessages,
      (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        );
      },
      () => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, streaming: false, id: undefined } : m
          )
        );
        setBusy(false);
        if (!open) setHasNew(true);
      },
      (errMsg) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: `Sorry, something went wrong: ${errMsg}`, streaming: false, id: undefined }
              : m
          )
        );
        setBusy(false);
      }
    );
  }, [messages, busy, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* ── Floating toggle button ── */}
      <motion.button
        onClick={open ? () => setOpen(false) : handleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #e85d04 0%, #ff8c38 100%)",
          boxShadow: "0 8px 32px rgba(232,93,4,0.45)",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{  scale: 0.94 }}
        aria-label={open ? "Close AI chat" : "Open AI chat"}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{   rotate: 90,   opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <CloseIcon />
            </motion.div>
          ) : (
            <motion.div key="sparkle"
              initial={{ rotate: 90,  opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{   rotate: -90,  opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-white"
            >
              <SparkleIcon />
            </motion.div>
          )}
        </AnimatePresence>

        {/* New-message dot */}
        {hasNew && !open && (
          <motion.span
            className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-white rounded-full border-2 border-[#e85d04]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
      </motion.button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: 24, scale: 0.95  }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: "rgba(13,13,13,0.97)",
              border:     "1px solid rgba(255,255,255,0.08)",
              boxShadow:  "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(232,93,4,0.08)",
              height:     "min(560px, calc(100vh - 8rem))",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/6"
              style={{ background: "linear-gradient(135deg, rgba(232,93,4,0.08) 0%, transparent 100%)" }}
            >
              <div className="w-8 h-8 rounded-full bg-[#e85d04]/10 border border-[#e85d04]/30 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-display font-700 text-sm tracking-wide leading-none">ROVER</p>
                <p className="text-white/35 text-xs mt-0.5">REVOLVER AI Assistant</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/30 text-xs">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#e85d04]/10 border border-[#e85d04]/20 flex items-center justify-center mb-4">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                  </div>
                  <p className="text-white font-display font-700 text-base mb-1">Hey, I'm ROVER</p>
                  <p className="text-white/40 text-sm mb-6 leading-relaxed">
                    REVOLVER's AI assistant. Ask me about our services, pricing, or marketing strategy.
                  </p>
                  <div className="w-full space-y-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="w-full text-left text-xs text-white/60 hover:text-white bg-white/3 hover:bg-white/8 border border-white/8 hover:border-white/15 rounded-xl px-3.5 py-2.5 transition-all duration-150"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <MessageBubble key={msg.id ?? i} msg={msg} />
                  ))}
                  {busy && messages[messages.length - 1]?.role !== "assistant" && (
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#e85d04]/10 border border-[#e85d04]/30 flex items-center justify-center flex-shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="2">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
                        </svg>
                      </div>
                      <div className="bg-white/6 border border-white/8 rounded-2xl rounded-tl-sm">
                        <TypingDots />
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="px-3 pb-3 pt-2 border-t border-white/6">
              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything…"
                  disabled={busy}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#e85d04]/40 focus:bg-white/8 transition-colors resize-none leading-snug"
                  style={{ maxHeight: "96px", overflowY: "auto" }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || busy}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: input.trim() && !busy
                      ? "linear-gradient(135deg, #e85d04, #ff8c38)"
                      : "rgba(255,255,255,0.06)",
                  }}
                >
                  <SendIcon />
                </button>
              </form>
              <p className="text-white/15 text-[10px] text-center mt-2">
                Powered by REVOLVER × Groq AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
