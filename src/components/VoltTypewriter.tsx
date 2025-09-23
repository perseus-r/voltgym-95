import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface VoltTypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
}

export function VoltTypewriter({ 
  text, 
  speed = 50, 
  delay = 0, 
  onComplete,
  className 
}: VoltTypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, currentIndex === 0 ? delay : speed);

      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, speed, delay, onComplete, isComplete]);

  return (
    <div className={className}>
      <span>{displayedText}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="text-accent ml-1"
      >
        |
      </motion.span>
    </div>
  );
}

interface ChatMessageProps {
  message: string;
  isAI?: boolean;
  timestamp?: string;
  avatar?: string;
}

export function VoltChatMessage({ 
  message, 
  isAI = false, 
  timestamp,
  avatar 
}: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 ${isAI ? 'justify-start' : 'justify-end'} mb-6`}
    >
      {isAI && (
        <motion.div 
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0 shadow-lg"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-accent text-sm font-bold">AI</span>
        </motion.div>
      )}
      
      <div className={`max-w-[75%] ${isAI ? 'order-2' : 'order-1'}`}>
        <motion.div
          className={`
            rounded-2xl px-5 py-4 relative shadow-lg backdrop-blur-sm
            ${isAI 
              ? 'bg-gradient-to-br from-card/90 to-surface/70 text-white border border-accent/20 shadow-accent/10' 
              : 'bg-gradient-to-br from-accent to-accent-2 text-accent-ink shadow-accent/25'
            }
          `}
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
        >
          {/* Glow effect para mensagens da IA */}
          {isAI && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-accent/10 blur-xl opacity-50"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}
          
          <div className="relative z-10">
            {isAI ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                className="text-sm leading-relaxed font-medium space-y-2"
                components={{
                  h1: ({node, ...props}) => <h1 className="text-lg font-bold text-txt mb-2" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-base font-semibold text-txt mb-2" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="text-txt" {...props} />,
                  strong: ({node, ...props}) => <strong className="text-white" {...props} />,
                  code: ({node, ...props}) => (
                    <code className="rounded bg-black/40 px-1.5 py-0.5 block p-3 mt-2" {...props} />
                  )
                }}
              >
                {message}
              </ReactMarkdown>
            ) : (
              <p className="text-sm leading-relaxed font-medium">{message}</p>
            )}
            
            {timestamp && (
              <p className={`text-xs mt-2 ${isAI ? 'text-txt-3' : 'text-accent-ink/70'}`}>
                {timestamp}
              </p>
            )}
          </div>
        </motion.div>
      </div>
      
      {!isAI && (
        <motion.div 
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-lg"
          whileHover={{ scale: 1.05, rotate: -5 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-white text-sm font-bold">U</span>
        </motion.div>
      )}
    </motion.div>
  );
}

interface VoltChatInterfaceProps {
  messages: Array<{
    id: string;
    text: string;
    isAI: boolean;
    timestamp: string;
  }>;
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
}

export function VoltChatInterface({ 
  messages, 
  onSendMessage, 
  isTyping = false 
}: VoltChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gradient-to-b from-surface/40 to-card/60 backdrop-blur-xl rounded-2xl border border-accent/20 overflow-hidden shadow-2xl">
      {/* Chat messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-transparent to-black/20">
        <AnimatePresence>
          {messages.map((msg) => (
            <VoltChatMessage
              key={msg.id}
              message={msg.text}
              isAI={msg.isAI}
              timestamp={msg.timestamp}
            />
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/30 flex items-center justify-center">
              <span className="text-accent text-sm font-bold">AI</span>
            </div>
            <div className="bg-gradient-to-r from-card/90 to-surface/70 backdrop-blur-sm rounded-2xl px-4 py-3 border border-accent/20 shadow-lg">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-accent rounded-full"
                    animate={{ 
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Input area */}
      <div className="p-6 border-t border-accent/20 bg-gradient-to-r from-surface/60 to-card/40 backdrop-blur-sm">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-gradient-to-r from-surface/80 to-input-bg/60 backdrop-blur-sm border border-accent/30 rounded-xl px-4 py-3 text-white placeholder-txt-3 focus:outline-none focus:border-accent/70 focus:shadow-lg transition-all duration-300"
          />
          <motion.button
            onClick={handleSend}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 191, 255, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-accent to-accent-2 text-accent-ink px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 disabled:opacity-50"
            disabled={!inputValue.trim() || isTyping}
          >
            Enviar
          </motion.button>
        </div>
      </div>
    </div>
  );
}