"use client";
import { Icons } from "@/assets/icons";
import { env } from "@/lib/env";
import { getLocalStorageItem } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import "swiper/css";
import ChatPopup from "./components/ChatPopup";
import "./styles.scss";

const ChatBot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { from: "user" | "bot"; text: string; data?: any }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, open]);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const token = getToken();
        const conversations = await fetch(`${env.CHAT_API_URL}/conversations`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const { messages: conversationMessages } = await conversations.json();

        for (const message of conversationMessages) {
          const productDetails = await getProductDetail(message.data || []);
          setMessages((msgs) => [
            ...msgs,
            {
              from: message.sender,
              text: message.text,
              data: productDetails,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    fetchConversation();
  }, []);

  const getProductDetail = async (productIds: string[]) => {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return [];
    }

    try {
      const productPromises = productIds.map((id) =>
        fetch(`${env.API_URL}/products/${id}`)
          .then((res) => res.json())
          .then((data) => data.data)
      );

      const products = await Promise.all(productPromises);
      return products.filter((product) => product); // Filter out any null/undefined values
    } catch (error) {
      console.error("Error fetching product details:", error);
      return [];
    }
  };

  // Helper to get token from localStorage
  const getToken = () => {
    if (typeof window === "undefined") return null;

    try {
      const raw = getLocalStorageItem("auth-storage");
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (
        typeof parsed !== "object" ||
        parsed === null ||
        typeof parsed.state !== "object" ||
        parsed.state === null
      ) {
        return null;
      }

      const token = parsed.state.token;
      return typeof token === "string" ? token : null;
    } catch (error) {
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { from: "user" as const, text: input, data: [] };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = getToken();
      const res = await fetch(`${env.CHAT_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      const productDetails = await getProductDetail(data.data || []);
      setMessages((msgs) => [
        ...msgs,
        {
          from: "bot",
          text: data.response,
          data: productDetails,
        },
      ]);
      setLoading(false);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Không thể kết nối tới trợ lý AI", data: [] },
      ]);
      setLoading(false);
    }
  };

  if (typeof window === "undefined") return null;

  return (
    <div className="chatbot">
      {/* Nút mở chat cố định góc phải dưới */}
      <div
        className="chatbot-fab"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open chat"
        style={{ zIndex: 10001 }}
      >
        <Icons.chatbot />
      </div>

      {/* Popup chat modal */}
      {open && (
        <ChatPopup
          open={open}
          messages={messages}
          loading={loading}
          onSend={handleSend}
          input={input}
          setInput={setInput}
          messagesEndRef={messagesEndRef}
          setOpen={setOpen}
        />
      )}
    </div>
  );
};

export default ChatBot;
