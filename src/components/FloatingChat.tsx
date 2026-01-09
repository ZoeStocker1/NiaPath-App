import { useState } from 'react';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface FloatingChatProps {
  recommendation: any;
  session: any;
  devMode: boolean;
}

export default function FloatingChat({ recommendation, session, devMode }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage = newMessage.trim();
    setNewMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://uxabftbphomuhputdrrc.supabase.co/functions/v1/rec-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': devMode ? '' : `Bearer ${session?.access_token}`,
          // 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbnBhZXJ0cW93dmtjdmJwYXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NjQyNzMsImV4cCI6MjA3NDU0MDI3M30.13yRodl7va76ODofo5BQ-dhmt5k-YARxkD1vRzlfIRg'
        },
        body: JSON.stringify({
          recOutput: recommendation,
          chatHistory: messages,
          newMessage: userMessage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!recommendation) return null;

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-elegant z-40",
          "bg-gradient-to-br from-primary to-primary-glow hover:from-primary-glow hover:to-primary",
          "transition-all duration-300 hover:scale-110",
          isOpen && "scale-0 opacity-0"
        )}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Panel */}
      <div
        className={cn(
          "fixed inset-0 flex items-center justify-center z-50",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none",
          "transition-all duration-300"
        )}
      >
        <div
          className={cn(
        "w-[90vw] h-[90vh] bg-background border border-border rounded-2xl shadow-2xl flex flex-col",
        "max-[640px]:w-[calc(100vw-2rem)] max-[640px]:h-[calc(100vh-2rem)]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Career Guide</h3>
        </div>
        <Button
          onClick={() => setIsOpen(false)}
          size="icon"
          variant="ghost"
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
          <p className="text-sm">Ask me anything about your career recommendations!</p>
            </div>
          )}
          {messages.map((message, index) => (
            <div
          key={index}
          className={cn(
            "flex",
            message.role === 'user' ? "justify-end" : "justify-start"
          )}
            >
          <div
            className={cn(
              "max-w-[80%] rounded-xl px-4 py-2",
              message.role === 'user'
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
            )}
          >
            {message.role === 'user' ? (
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            ) : (
              <ReactMarkdown
                className="prose dark:prose-invert max-w-none
                  prose-p:text-foreground prose-p:my-4
                  prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight prose-headings:mb-4 prose-h1:text-4xl prose-h1:mb-6 prose-h1:border-b prose-h1:pb-2 prose-h2:text-3xl prose-h2:mb-5 prose-h2:border-b prose-h2:pb-2 prose-h3:text-2xl prose-h3:mb-4 prose-h4:text-xl prose-h4:mb-3 prose-h5:text-lg prose-h5:mb-2 prose-h6:text-base prose-h6:mb-1
                  prose-a:text-primary prose-a:underline
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-code:text-primary prose-code:bg-background/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-background prose-pre:border prose-pre:border-border prose-pre:my-2
                  prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                  prose-ul:my-1 prose-ol:my-1 prose-li:text-foreground
                  prose-table:border prose-table:border-border prose-table:rounded-lg prose-table:overflow-hidden prose-table:p-4
                  prose-th:bg-muted prose-th:text-foreground prose-th:font-semibold prose-th:p-4
                  prose-td:text-foreground prose-td:p-4 prose-td:border-t prose-td:border-border
                  [&_table]:w-full [&_table]:overflow-x-auto [&_pre]:overflow-x-auto"
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {message.content}
              </ReactMarkdown>

            )}
          </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
          <div className="bg-muted rounded-xl px-4 py-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
            </div>
          </div>
            </div>
          )}
        </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !newMessage.trim()}
            size="icon"
            className="h-10 w-10"
          >
            {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
          <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
          </div>
        </div>
      </div>
    </>
  );
}