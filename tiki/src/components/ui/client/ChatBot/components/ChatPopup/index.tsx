import instance from "@/api/axios";
import { Icons } from "@/assets/icons";
import { useAuth } from "@/hooks/useAuth";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  messages: { from: "user" | "bot"; text: string; data?: any }[];
  loading: boolean;
  input: string;
  setInput: (input: string) => void;
  onSend: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatPopup: React.FC<Props> = ({
  setOpen,
  messages,
  loading,
  input,
  setInput,
  onSend,
  messagesEndRef,
}) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const cardVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
      },
    }),
    exit: { opacity: 0, y: -30, scale: 0.95, transition: { duration: 0.6 } },
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      onSend();
    } else if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setInput(input + "\n");
      setRows(Math.min(rows + 1, 5));
    }
  };

  // Auto-adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const lineHeight =
        parseInt(window.getComputedStyle(textarea).lineHeight, 10) || 20;
      const baseRows = 1;

      if (!input) {
        textarea.rows = baseRows;
        textarea.style.height = `${baseRows * lineHeight}px`;
        setRows(baseRows);
      } else {
        textarea.style.height = "auto";
        const scrollHeight = textarea.scrollHeight;
        const newRows = Math.min(Math.floor(scrollHeight / lineHeight), 5);
        textarea.rows = newRows;
        textarea.style.height = `${Math.min(scrollHeight, 120)}px`;
        setRows(newRows);
      }
    }
  }, [input]);

  const handleDeleteConversation = async () => {
    try {
      const response = await instance.delete(
        `${env.CHAT_API_URL}/conversations`
      );
      toast.success(response.data.message);
      // Xóa tin nhắn khỏi state sau khi xóa thành công
      
    } catch (error: any) {
      console.error("Error deleting conversation:", error);
      toast.error(
        error.response?.data?.detail || "Failed to delete conversation"
      );
    }
  };

  return (
    <div
      className="chatbot-modal chatbot-modal-popup"
      style={{
        position: "fixed",
        bottom: 90,
        right: 32,
        zIndex: 10002,
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
      }}
    >
      <div className="chatbot-modal-header">
        <span className="chatbot-modal-title flex items-center gap-2">
          <Icons.chatbot className="text-[#0070f3]" />
          Trợ Lý AI
        </span>
        <div className="flex items-center gap-2">
          {isAuthenticated && messages.length > 0 && (
            <button
              onClick={handleDeleteConversation}
              aria-label="Delete conversation"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <Icons.clear />
            </button>
          )}
          <button
            className="chatbot-modal-close"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="chatbot-modal-close-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      {!isAuthenticated ? (
        <div
          className="chatbot-modal-messages"
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              marginBottom: 16,
              fontWeight: 500,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Hãy đăng nhập trước khi nhắn tin với trợ lý AI
          </div>
          <button
            className="chatbot-modal-send"
            style={{ minWidth: 120, fontWeight: 600, fontSize: 16 }}
            onClick={() => {
              setOpen(false);
              router.push("/login");
            }}
          >
            Đăng nhập
          </button>
        </div>
      ) : (
        <>
          <div
            className="chatbot-modal-messages"
            onWheel={(e) => e.stopPropagation()}
          >
            {messages.length === 0 ? (
              <div className="chatbot-msg-bot chatbot-msg-welcome">
                Chào mừng bạn đến với trợ lý AI! Hãy cho tôi biết bạn cần gì.
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isBotProductMsg = msg.from === "bot";
                return (
                  <div
                    key={idx}
                    className={
                      msg.from === "user"
                        ? "chatbot-msg-user"
                        : "chatbot-msg-bot"
                    }
                  >
                    <div className="text-wrap break-words"> {msg.text}</div>
                    {isBotProductMsg &&
                      Array.isArray(msg.data) &&
                      msg.data.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <AnimatePresence>
                            {msg.data.map((product: any, i: number) => (
                              <motion.div
                                key={product.uuid || i}
                                className="chatbot-product-card"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={cardVariants}
                                onClick={() =>
                                  router.push(
                                    `/product/${product.slug}/${product.uuid}`
                                  )
                                }
                                style={{
                                  cursor: "pointer",
                                  border: "1px solid #eee",
                                  borderRadius: 8,
                                  padding: 8,
                                  background: "#fafafa",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 12,
                                  marginBottom: 8,
                                }}
                              >
                                <img
                                  src={product.images?.[0]?.url}
                                  alt={product.name}
                                  style={{
                                    width: 60,
                                    height: 60,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                  }}
                                />
                                <div>
                                  <div
                                    style={{ fontWeight: 600 }}
                                    className="line-clamp-2"
                                  >
                                    {product.name}
                                  </div>
                                  <div
                                    style={{
                                      color: "#0070f3",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {product.new_price?.toLocaleString()} đ
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                  </div>
                );
              })
            )}
            {loading && (
              <div className="chatbot-msg-bot">
                <div className="chatbot-msg-typing">
                  <div className="chatbot-msg-dot" />
                  <div className="chatbot-msg-dot" />
                  <div className="chatbot-msg-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-modal-input">
            <textarea
              data-lenis-prevent
              ref={textareaRef}
              className={cn(
                "chatbot-modal-inputbox overflow-y-auto outline-none",
                textareaRef.current?.rows === 1 ? "scrollbar-hide" : ""
              )}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              rows={1}
              style={{
                resize: "none",
                minHeight: "40px",
                maxHeight: "120px",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
            <button
              className="chatbot-modal-send"
              onClick={onSend}
              disabled={loading}
              style={{
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              Gửi
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPopup;
