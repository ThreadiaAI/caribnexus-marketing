"use client";

import { useState, useRef, useEffect } from "react";
import GrainyOrb from "./GrainyOrb";
import { VoiceClient, streamChat } from "@/lib/voice-client";

const ASK_SUGGESTIONS = [
  "What services do you offer?",
  "How much does it cost?",
  "Tell me about CaribBooks",
  "How does AI save me money?",
];

const BOOK_SUGGESTIONS = [
  "My business is...",
  "I need help with...",
  "My email is...",
  "We have 20 employees",
];

export function VoiceWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"ask" | "book">("ask");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const voiceClientRef = useRef<VoiceClient | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, transcript, isProcessing]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsOpen(true);
      if (detail === "book") setMode("book");
    };
    window.addEventListener("open-voice-widget", handler);
    return () => window.removeEventListener("open-voice-widget", handler);
  }, []);

  // Create session when widget opens
  useEffect(() => {
    if (isOpen && !sessionIdRef.current) {
      const id = `ses_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      sessionIdRef.current = id;
      fetch("/api/voice/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", session_id: id, mode, source_page: window.location.pathname }),
      }).catch(() => {});
    }
    if (!isOpen) {
      // Complete session on close
      if (sessionIdRef.current && messages.length > 0) {
        fetch("/api/voice/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "complete", session_id: sessionIdRef.current }),
        }).catch(() => {});
      }
      sessionIdRef.current = "";
    }
  }, [isOpen]);

  const sendToAI = (userText: string) => {
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsProcessing(true);

    const chatMessages = [
      ...messages.map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
      { role: "user", content: userText },
    ];

    let aiText = "";
    streamChat(
      chatMessages,
      (chunk) => {
        aiText += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.role === "ai") {
            return [...prev.slice(0, -1), { role: "ai" as const, text: aiText }];
          }
          return [...prev, { role: "ai" as const, text: aiText }];
        });
      },
      () => {
        setIsProcessing(false);
        // Persist conversation to DDB
        if (sessionIdRef.current) {
          const allMsgs = [...messages, { role: "user", text: userText }, { role: "ai", text: aiText }];
          fetch("/api/voice/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "append", session_id: sessionIdRef.current, messages: allMsgs }),
          }).catch(() => {});
        }
      }
    );
  };

  const handleToggleListening = async () => {
    if (isListening) {
      // Stop mic, get final transcript, send to AI
      const finalText = voiceClientRef.current?.stop() || transcript;
      setIsListening(false);
      if (finalText.trim()) {
        setTranscript("");
        sendToAI(finalText.trim());
      }
    } else {
      // Start mic with Deepgram
      setIsListening(true);
      setTranscript("");
      const client = new VoiceClient((text) => {
        setTranscript(text);
      });
      voiceClientRef.current = client;
      try {
        await client.start();
      } catch (err) {
        console.error("Mic access denied or Deepgram error:", err);
        setIsListening(false);
      }
    }
  };

  const handleSuggestion = (text: string) => {
    sendToAI(text);
  };

  return (
    <>
      {/* Floating orb trigger — bottom right with FAQ clouds */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-[80]">
          {/* FAQ speech bubbles orbiting the orb */}
          <div className="absolute" style={{ bottom: "68px", right: "60px", animation: "float1 6s ease-in-out infinite" }}>
            <div className="bg-white border border-cn-border rounded-full px-3 py-1.5 shadow-sm whitespace-nowrap">
              <span className="text-[9px] text-cn-muted leading-none">What services do you offer?</span>
            </div>
          </div>
          <div className="absolute" style={{ bottom: "40px", right: "90px", animation: "float2 7s ease-in-out infinite" }}>
            <div className="bg-white border border-cn-border rounded-full px-3 py-1.5 shadow-sm whitespace-nowrap">
              <span className="text-[9px] text-cn-muted leading-none">How does AI save money?</span>
            </div>
          </div>
          <div className="absolute" style={{ bottom: "90px", right: "10px", animation: "float3 8s ease-in-out infinite" }}>
            <div className="bg-white border border-cn-border rounded-full px-3 py-1.5 shadow-sm whitespace-nowrap">
              <span className="text-[9px] text-cn-muted leading-none">Tell me about CaribBooks</span>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="relative hover:scale-105 transition-transform"
            aria-label="Open voice consultation"
          >
            <GrainyOrb size={72} amplitude={0} />
          </button>
        </div>
      )}

      {/* Slide-up widget panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[90] w-[330px] h-[460px] bg-white rounded-2xl shadow-2xl border border-cn-border flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-2 border-b border-cn-border flex items-center justify-between">
            <span className="text-[11px] font-medium text-cn-dark">CaribNexus AI</span>
            <button
              onClick={() => { setIsOpen(false); setIsListening(false); setTranscript(""); setMessages([]); setMode("ask"); }}
              className="text-cn-muted hover:text-[#FF5733] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Transcript / Response area */}
          <div ref={scrollRef} className="flex-1 px-5 py-4 overflow-y-auto">
            {messages.length === 0 && !transcript && !isProcessing ? (
              <div className="h-full flex flex-col items-center justify-center">
                <GrainyOrb size={72} amplitude={isListening ? 0.6 : 0} />
                <p className="text-[11px] text-cn-muted text-center mt-4" style={{ lineHeight: "16px" }}>
                  {isListening
                    ? <>I&apos;m listening. Tap send when you&apos;re done.</>
                    : mode === "ask"
                    ? <>Ask us anything about CaribNexus AI and<br />our products &amp; services.</>
                    : <>Book a consultation. Tell us your name, business name, industry, number of employees, email address,<br />and what you need help with.</>
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Message history */}
                {messages.map((msg, i) => (
                  <div key={i}>
                    <span className={`text-[8px] font-medium uppercase tracking-wider ${msg.role === "user" ? "text-[#FF5733]" : "text-cn-dark"}`}>
                      {msg.role === "user" ? "You" : "CaribNexus AI"}
                    </span>
                    <p className="text-[12px] text-cn-dark mt-0.5" style={{ lineHeight: "18px" }}>
                      {msg.text}
                    </p>
                  </div>
                ))}
                {/* Live transcript */}
                {isListening && transcript && (
                  <div>
                    <span className="text-[8px] font-medium text-[#FF5733] uppercase tracking-wider">You</span>
                    <p className="text-[12px] text-cn-dark mt-0.5" style={{ lineHeight: "18px" }}>
                      {transcript}<span className="animate-pulse text-[#FF5733]">|</span>
                    </p>
                  </div>
                )}
                {/* Processing */}
                {isProcessing && (
                  <div className="text-[11px] text-cn-muted animate-pulse">Thinking...</div>
                )}
              </div>
            )}
          </div>

          {/* Bottom: orb + speak button + tabs */}
          <div className="px-3 py-2 border-t border-cn-border flex items-center gap-2 flex-wrap">
            <div className={isListening ? "animate-pulse" : ""}>
              <GrainyOrb size={32} amplitude={isListening ? 0.8 : 0} />
            </div>
            <button
              onClick={handleToggleListening}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                isListening
                  ? "border-2 border-[#FF5733] animate-pulse shadow-sm"
                  : "border border-cn-border hover:border-[#FF5733]"
              }`}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={isListening ? "#FF5733" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="11" rx="3" />
                <path d="M5 10a7 7 0 0014 0" />
                <path d="M12 17v4" />
                <path d="M8 21h8" />
              </svg>
              <span className={`text-[9px] font-medium ${isListening ? "text-[#FF5733]" : "text-cn-muted"}`}>
                {isListening ? "Tap to send" : "Speak with me"}
              </span>
            </button>
            <div className="flex gap-1">
              <button
                onClick={() => { setMode("ask"); setTranscript(""); setMessages([]); }}
                className={`text-[8px] font-medium px-2 py-1 rounded-full transition-colors ${mode === "ask" ? "bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] text-white" : "text-cn-muted border border-cn-border"}`}
              >
                Ask
              </button>
              <button
                onClick={() => { setMode("book"); setTranscript(""); setMessages([]); }}
                className={`text-[8px] font-medium px-2 py-1 rounded-full transition-colors ${mode === "book" ? "bg-gradient-to-r from-[#0077B6] via-[#00A859] to-[#FF5733] text-white" : "text-cn-muted border border-cn-border"}`}
              >
                Book
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
