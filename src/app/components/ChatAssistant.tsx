import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'bot' | 'user', text: string}[]>([
    { role: 'bot', text: 'Namaste! I am your Cyber Sahayta Assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user' as const, text: inputValue }];
    setMessages(newMessages);
    setInputValue('');

    // Mock bot response
    setTimeout(() => {
      let response = "I'm not sure about that. Can you please contact the helpline 1930?";
      const lowerInput = inputValue.toLowerCase();
      
      if (lowerInput.includes('status') || lowerInput.includes('track')) {
        response = "You can track your complaint status from the dashboard timeline. It shows real-time updates from 'Submitted' to 'Closed'.";
      } else if (lowerInput.includes('fir')) {
        response = "Once an FIR is registered, a download button will appear in your complaint timeline.";
      } else if (lowerInput.includes('fraud') || lowerInput.includes('money')) {
        response = "For financial fraud, please report immediately to 1930 to freeze the transaction.";
      }

      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-orange-600 hover:bg-orange-700 z-50 flex items-center justify-center"
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageSquare className="h-6 w-6 text-white" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] shadow-2xl z-50 flex flex-col border-slate-200 animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 rounded-t-xl flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-full">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Cyber Sahayta</h3>
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 block animate-pulse" />
                Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100 rounded-b-xl">
            <form onSubmit={handleSend} className="flex gap-2">
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your query..." 
                className="flex-1 text-sm"
              />
              <Button type="submit" size="sm" className="bg-slate-900 hover:bg-slate-800">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}
