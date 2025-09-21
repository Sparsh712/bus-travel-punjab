
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { MessageAuthor } from '../types';
import { getSmartTravelAdvice } from '../services/geminiService';
import { RouteResultCard } from './RouteResultCard';
import { SparklesIcon } from './icons/SparklesIcon';
import { UserIcon } from './icons/UserIcon';

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { author: MessageAuthor.AI, text: "Hello! How can I help you navigate Punjab's public transport today? Ask me anything, like 'How to get from Anarkali to UET?'" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { author: MessageAuthor.USER, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getSmartTravelAdvice(input);
      const aiMessage: ChatMessage = {
        author: MessageAuthor.AI,
        text: aiResponse.summary,
        routeSuggestion: aiResponse.route
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        author: MessageAuthor.AI,
        text: "Sorry, I encountered an error. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // FIX: Used React.FC to correctly type the component, resolving an issue where React's special 'key' prop was being incorrectly passed to the component's props.
  const MessageBubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
    const isUser = msg.author === MessageAuthor.USER;
    return (
      <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && <div className="w-8 h-8 rounded-full bg-orange-500 flex-shrink-0 flex items-center justify-center"><SparklesIcon className="w-5 h-5 text-white" /></div>}
        <div className={`max-w-md p-4 rounded-xl ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'}`}>
          <p>{msg.text}</p>
          {msg.routeSuggestion && (
            <div className="mt-4">
              <p className="text-sm font-semibold mb-2">Here's a route I found for you:</p>
              <RouteResultCard route={msg.routeSuggestion} />
            </div>
          )}
        </div>
         {isUser && <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0 flex items-center justify-center"><UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" /></div>}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl mx-auto flex flex-col h-[75vh] animate-fade-in">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold text-center">AI Travel Assistant</h2>
      </div>
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {messages.map((msg, index) => <MessageBubble key={index} msg={msg} />)}
        {isLoading && (
          <div className="flex justify-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex-shrink-0 flex items-center justify-center"><SparklesIcon className="w-5 h-5 text-white" /></div>
            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-xl rounded-bl-none">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-150"></div>
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 border-t dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your travel question..."
            disabled={isLoading}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:bg-orange-400 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;
