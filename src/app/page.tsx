"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Moon, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: number;
  sender: "user" | "ai";
  text: string;
};

// ✅ Small Tic-Tac-Toe Game Component
const TicTacToe: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const winner = calculateWinner(board);

  const handleClick = (index: number) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="mt-4">
      <h3 className="text-md font-bold mb-2">🎮 Mini Tic-Tac-Toe</h3>

      {/* Status */}
      <p className="mb-2 text-sm">
        {winner
          ? `🏆 Winner: ${winner}`
          : board.every((cell) => cell)
          ? "🤝 It's a Draw!"
          : `Turn: ${xIsNext ? "X" : "O"}`}
      </p>

      {/* Board */}
      <div className="grid grid-cols-3 gap-1 w-32">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            className={cn(
              "w-10 h-10 flex items-center justify-center text-lg font-bold border rounded transition-colors",
              darkMode
                ? "border-gray-500 hover:bg-gray-700"
                : "border-gray-400 hover:bg-gray-200"
            )}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Reset Button */}
      <Button
        onClick={resetGame}
        variant="outline"
        size="sm"
        className="mt-3 text-xs"
      >
        🔄 Reset Game
      </Button>
    </div>
  );
};

// ✅ Winner Calculation Helper
function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function ChatBotUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    const conversation = [...messages, newMessage].map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      text: m.text,
    }));

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.reply || "🤖 (No response)",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }

    setLoading(false);
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full transition-colors p-6",
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* LEFT PANEL */}
        <div
          className={cn(
            "p-6 rounded-2xl shadow-lg border flex flex-col gap-4",
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
          )}
        >
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-blue-500" />
            <h2 className="text-xl font-bold">About Boxy.ai</h2>
          </div>
          <p className="text-sm leading-relaxed">
            <strong>Boxy.ai</strong> now remembers your previous messages! It
            uses:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>⚡ <strong>Next.js</strong> + TypeScript</li>
            <li>🎨 <strong>Tailwind CSS</strong></li>
            <li>🧩 <strong>shadcn/ui</strong> components</li>
            <li>🧠 <strong>Gemini API with conversation memory</strong></li>
          </ul>

          {/* ✅ Mini Tic-Tac-Toe Game */}
          <TicTacToe darkMode={darkMode} />

          {/* Dark Mode Toggle */}
          <Button
            onClick={() => setDarkMode(!darkMode)}
            className={cn(
              "mt-auto flex items-center gap-2 transition-colors",
              darkMode
                ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                : "bg-gray-900 hover:bg-gray-800 text-white"
            )}
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4" /> Light Mode
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" /> Dark Mode
              </>
            )}
          </Button>

          {/* ✅ Credit Section */}
          <p className="text-xs text-center mt-3 opacity-70">
            Made by{" "}
            <a
              href="https://www.linkedin.com/in/ankur-kumar-sah-36b590322/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-400"
            >
              Ankur Sah
            </a>
          </p>
        </div>

        {/* RIGHT PANEL - Chatbot */}
        <div className="md:col-span-2 flex flex-col">
          <div
            className={cn(
              "flex flex-col h-[75vh] rounded-2xl shadow-xl border",
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
            )}
          >
            <header className="flex justify-center items-center p-4 border-b">
              <h1 className="text-lg font-bold">Boxy.ai Chat</h1>
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <Card
                    className={cn(
                      "max-w-xs p-3 rounded-2xl shadow-md",
                      msg.sender === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : darkMode
                        ? "bg-gray-700 text-gray-100 rounded-bl-none"
                        : "bg-gray-100 text-gray-900 rounded-bl-none"
                    )}
                  >
                    <CardContent className="p-0">{msg.text}</CardContent>
                  </Card>
                </div>
              ))}
              {loading && <p className="text-center text-sm">🤖 Thinking...</p>}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="border-t p-3 flex gap-2">
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend}>Send</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
