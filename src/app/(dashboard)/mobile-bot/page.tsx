"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { mobileHrBot } from "@/ai/flows/mobile-hr-bot";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export default function MobileBotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I help you today? You can ask me to request leave, get a payslip, or check your job application status.", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simple logic to parse request type from input
      let requestType: 'leave' | 'payslip' | 'jobApplicationStatus' = 'jobApplicationStatus';
      if (input.toLowerCase().includes('leave')) {
        requestType = 'leave';
      } else if (input.toLowerCase().includes('payslip')) {
        requestType = 'payslip';
      }

      const response = await mobileHrBot({
        employeeId: "EMP12345", // Mock employee ID
        requestType,
        details: input,
      });

      const botMessage: Message = { id: Date.now() + 1, text: response.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error with HR bot:", error);
      const errorMessage: Message = { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting. Please try again later.", sender: "bot" };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mobile/WhatsApp HR Bot"
        description="Interact with the AI assistant for leave, payslips, and job status."
      />
      <div className="flex justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <Bot className="mx-auto h-10 w-10 text-primary" />
            <CardTitle>HR Assistant</CardTitle>
            <CardDescription>Your personal AI-powered HR bot.</CardDescription>
          </CardHeader>
          <CardContent className="h-[500px] overflow-y-auto p-4 space-y-4 bg-muted/20 border-y">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-end gap-2",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.sender === "bot" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot className="h-4 w-4"/></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-lg p-3 text-sm",
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border"
                  )}
                >
                  {msg.text}
                </div>
                 {msg.sender === "user" && (
                  <Avatar className="h-8 w-8">
                     <AvatarFallback><User className="h-4 w-4"/></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
                 <div className="flex items-end gap-2 justify-start">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot className="h-4 w-4"/></AvatarFallback>
                    </Avatar>
                    <div className="max-w-[75%] rounded-lg p-3 text-sm bg-card border">
                       <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="p-4">
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
