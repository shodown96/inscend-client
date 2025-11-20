import { History, MessageSquare, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { useBrainstormStore, type ChatSession, type ViewType } from "@/lib/stores/brainstorm";

export default function BrainstormHistoryView({ setCurrentView }: {
    setCurrentView: (v: ViewType) => void
}) {
    const {
        setCurrentMessages,
        chatHistory,
        setChatHistory,
        currentSessionId,
        setCurrentSessionId,
    } = useBrainstormStore()


    // Initialize new chat session
    const startNewChat = () => {
        const newSessionId = `session-${Date.now()}`;
        setCurrentSessionId(newSessionId);
        setCurrentMessages([]);
        setCurrentView('chat');
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
    )
}
