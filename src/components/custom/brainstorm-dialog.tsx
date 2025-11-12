import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger
} from "@/components/ui/drawer"
import { useBrainstormStore, type ChatSession, type Message } from "@/lib/stores/brainstorm"
import { ArrowLeft, Clock, History, MessageSquare, Send, Trash2, X } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import BrainstormSelect from "./brainstorm-select"

function OutlinedIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <rect width="23" height="23" fill="url(#pattern0_838_82255)" />
      <defs>
        <pattern id="pattern0_838_82255" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlinkHref="#image0_838_82255" transform="scale(0.0111111)" />
        </pattern>
        <image id="image0_838_82255" width="90" height="90" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" />
      </defs>
    </svg>
  )
}
function WhiteIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <rect width="23" height="23" fill="url(#pattern0_838_77241)" />
      <defs>
        <pattern id="pattern0_838_77241" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlinkHref="#image0_838_77241" transform="scale(0.0111111)" />
        </pattern>
        <image id="image0_838_77241" width="90" height="90" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" />
      </defs>
    </svg>
  )
}


export default function BrainstormDialog({ outlined = false }) {
  const [currentView, setCurrentView] = useState<'chat' | 'history'>('chat');
  const [message, setMessage] = useState('');
  const {
    currentMessages,
    setCurrentMessages,
    chatHistory,
    setChatHistory,
    currentSessionId,
    setCurrentSessionId,
    isLoading,
    setIsLoading,
  } = useBrainstormStore()


  // Initialize new chat session
  const startNewChat = () => {
    const newSessionId = `session-${Date.now()}`;
    setCurrentSessionId(newSessionId);
    setCurrentMessages([]);
    setCurrentView('chat');
  };

  // Send message
  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setCurrentMessages([...currentMessages, userMessage]);
    setMessage('');
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: 'This is a simulated response from the AI assistant. In production, this would be replaced with actual API calls to your brainstorm AI service.',
        timestamp: new Date(),
      };


      const updatedMessages = [...currentMessages, aiMessage];

      // Save or update session in history
      if (currentSessionId) {

        const existingIndex = chatHistory.findIndex(s => s.id === currentSessionId);
        const session: ChatSession = {
          id: currentSessionId,
          title: updatedMessages[0]?.content.slice(0, 50) || 'New Chat',
          messages: updatedMessages,
          createdAt: existingIndex >= 0 ? chatHistory[existingIndex].createdAt : new Date(),
          updatedAt: new Date(),
        };

        if (existingIndex >= 0) {
          const newHistory = [...chatHistory];
          newHistory[existingIndex] = session;
          setChatHistory(newHistory);
        }
        setChatHistory([session, ...chatHistory]);
      }

      setCurrentMessages(updatedMessages)

      setIsLoading(false);
    }, 1000);
  };

  // Load chat from history
  const loadChatSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setCurrentMessages(session.messages);
    setCurrentView('chat');
  };

  // Delete chat session
  const deleteSession = (sessionId: string) => {
    setChatHistory(chatHistory.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      startNewChat();
    }
  };
  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant={outlined ? 'outline' : 'default'}>
          {outlined ? (
            <OutlinedIcon />
          ) : (
            <WhiteIcon />
          )}

          <span>Brainstorm</span>
        </Button>

      </DrawerTrigger>
      <DrawerContent className="p-0">
        <DrawerHeader className="p-4 border-b">
          {currentView === 'chat' ? (
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <OutlinedIcon />
                <div className="font-semibold">Brainstorm</div>
              </div>
              <DrawerClose className="cursor-pointer"><X /></DrawerClose>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <ArrowLeft className=" cursor-pointer" onClick={() => setCurrentView('chat')} />
              <div className="font-semibold">Brainstorm Library</div>
            </div>

          )}
        </DrawerHeader>
        <div className="flex items-center justify-between border-b p-4">
          <BrainstormSelect />
          <Clock className="size-5 cursor-pointer" onClick={() => setCurrentView('history')} />
        </div>

        {/* Chat View */}
        {currentView === 'chat' && (
          <div className="flex flex-col h-full">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              {currentMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <OutlinedIcon />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    Start a new conversation
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Ask me anything about your business analytics, sales trends, or customer insights.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-900'
                          }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {msg.timestamp.toLocaleTimeString()}
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

            {/* Input Area */}
            <DrawerFooter className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  // onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading}
                  containerClass="w-full"
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !message.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </DrawerFooter>
          </div>
        )}

        {/* History View */}
        {currentView === 'history' && (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-4">
              <div className="mb-4">
                <Button onClick={startNewChat} className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start New Chat
                </Button>
              </div>

              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <History className="size-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">No chat history</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Your previous conversations will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {chatHistory.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <button
                        onClick={() => loadChatSession(session)}
                        className="flex-1 text-left"
                      >
                        <h4 className="font-medium text-gray-900 truncate">
                          {session.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {session.messages.length} messages • {session.updatedAt.toLocaleDateString()}
                        </p>
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteSession(session.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}

      </DrawerContent>
    </Drawer>
  )
}
