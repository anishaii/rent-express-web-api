"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import { XIcon, SendIcon } from "lucide-react";
import robotIcon from "@/app/assets/robot.png";
import { handleGenerateContent } from "@/lib/actions/ai/gemini-action";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const starterMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hi, I'm Wall-E 👋 Ask me anything about renting a vehicle, or I can help you find the right one.",
  },
];

const formatMessage = (value: unknown) => {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return "No content generated.";
};

export default function WallEChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(starterMessages);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [chatHistory, isSending, isOpen]);

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isSending) return;

    setPrompt("");
    setIsSending(true);
    setChatHistory((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: trimmedPrompt },
    ]);

    try {
      const result = await handleGenerateContent(trimmedPrompt);
      const resultData = formatMessage(
        result.data?.candidates?.[0]?.content?.parts?.[0]?.text,
      );

      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: result.success ? resultData : result.message || "Something went wrong.",
        },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      setChatHistory((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: message },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-90 h-125 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden">
          <div className="bg-[#0092B8] px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shrink-0">
                <Image src={robotIcon} alt="Wall-E" width={26} height={26} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Wall-E</p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  <span className="text-xs text-cyan-50">AI Assistant</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <XIcon className="h-4 w-4 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#f8fafb]">
            <div className="space-y-3">
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-[#0092B8] text-white"
                        : "bg-white border border-gray-100 text-[#13303a]"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white border border-gray-100 px-3.5 py-2.5 text-sm text-[#8093a0]">
                    Wall-E is typing...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-gray-100 p-3 shrink-0">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                value={prompt}
                onChange={handlePromptChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a question..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#13303a] outline-none placeholder:text-[#8093a0] focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={isSending || !prompt.trim()}
                className="h-10 w-10 shrink-0 rounded-xl bg-[#0092B8] hover:bg-[#007a99] flex items-center justify-center disabled:opacity-40 transition-colors"
              >
                <SendIcon className="h-4 w-4 text-white" />
              </button>
            </form>
            <p className="text-[11px] text-[#8093a0] mt-2 text-center">
              AI can make mistakes. Cross-check important information.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-18 w-18 rounded-full bg-white border border-gray-100 shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        {isOpen ? (
          <XIcon className="h-5 w-5 text-[#13303a]" />
        ) : (
          <Image src={robotIcon} alt="Wall-E" width={37} height={37} />
        )}
      </button>
    </div>
  );
}