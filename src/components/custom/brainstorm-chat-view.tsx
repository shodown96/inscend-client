import {
  DrawerFooter
} from "@/components/ui/drawer"
import { useBrainstormStore, type ChatSession, type Message } from "@/lib/stores/brainstorm"
import { Send } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { OutlinedIcon } from "./brianstorm-icons"
import { useAuthStore } from "@/lib/stores/auth"
import { API_ENDPOINTS } from "@/lib/constants"
import { determineBusinessCategory } from "@/lib/utils"


export default function BrainstormChatView() {
  const [message, setMessage] = useState("");

  const { user } = useAuthStore();

  const {
    currentMessages,
    setCurrentMessages,
    chatHistory,
    setChatHistory,
    currentSessionId,
    isLoading,
    setIsLoading,
    businessData,
    selectedArea,
    setCurrentSessionId,
  } = useBrainstormStore();


  // 🧠 Stream-safe Zustand updater
  const updateAssistantMessage = (id: string, chunk: string) => {
    const latest = useBrainstormStore.getState().currentMessages;

    setCurrentMessages(
      latest.map((msg) =>
        msg.id === id
          ? { ...msg, content: msg.content + chunk }
          : msg
      )
    );
  };


  // 🚀 SEND MESSAGE (STREAMING)
  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);

    // 1. Create USER message
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    // 2. Create placeholder ASSISTANT message
    const assistantMsgId = `msg-${Date.now()}-ai`;
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    // 3. Push both messages into chat
    setCurrentMessages([...currentMessages, userMsg, assistantMsg]);

    // 4. Build request
    const body = {
      message,
      business_id: user?.businessId,
      session_id: currentSessionId,
      focus_area: selectedArea,
      business_type: determineBusinessCategory(user?.business?.type || "Service"),
      business_data: businessData,
    };

    setMessage("");

    // 5. Call API
    const response = await fetch(API_ENDPOINTS.Brainstorm.ExternalChat, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // 6. Capture session ID (if new session)
    const sessionId = response.headers.get("X-Session-Id");
    if (sessionId) setCurrentSessionId(sessionId);

    // 7. Start streaming
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const read = await reader?.read();
      if (read?.done) break;

      const chunk = decoder.decode(read?.value);
      updateAssistantMessage(assistantMsgId, chunk);
    }

    setIsLoading(false);

    // 8. Save session to history
    const latestMessages = useBrainstormStore.getState().currentMessages;

    const session: ChatSession = {
      id: `${sessionId || currentSessionId}`,
      title: latestMessages[0]?.content.slice(0, 40) || "New Chat",
      messages: latestMessages,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setChatHistory([session, ...chatHistory]);
  };


  return (
    <div className="flex flex-col h-full">
      {/* CHAT MESSAGES */}
      <ScrollArea className="flex- p-4 h-[calc(100vh-200px)]! overflow-y-hidden">
        {currentMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <OutlinedIcon />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Start a conversation
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Ask anything about your business, insights, or strategy.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${msg.role === "user"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-900"
                    }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {msg?.timestamp?.toLocaleTimeString ?msg?.timestamp?.toLocaleTimeString(): "-"}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* INPUT */}
      <DrawerFooter className="p-4 border-t">
        <div className="flex gap-2 w-full">
          <Input
            placeholder="Ask me anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
            containerClass="w-full"
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !message.trim() || !businessData}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DrawerFooter>
    </div>
  );
}
