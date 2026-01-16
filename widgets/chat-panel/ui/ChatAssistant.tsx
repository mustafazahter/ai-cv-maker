import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Plus, Sparkles, Loader2, Trash2, BrainCircuit, ChevronDown, ChevronRight, FileText, X, Image as ImageIcon, ArrowUp } from 'lucide-react';
import { ChatMessage, ResumeData, GeminiModel } from '@/shared/types';
import { chatWithCVAgent, FileAttachment } from '@/shared/api/gemini';

interface ChatAssistantProps {
  apiKey: string | null;
  currentResumeData: ResumeData;
  onUpdateResume: (data: ResumeData) => void;
  onRequestApiKey: () => void;
  onResetCV?: () => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ apiKey, currentResumeData, onUpdateResume, onRequestApiKey, onResetCV }) => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<GeminiModel>('gemini-flash-latest');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'system',
      content: t('chat.welcomeMessage'),
      timestamp: Date.now()
    }
  ]);
  const [attachment, setAttachment] = useState<{ file: File, previewUrl: string, type: 'image' | 'pdf' } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      // First reset height to auto to correctly calculate scrollHeight for shrinkage
      textareaRef.current.style.height = 'auto';

      // If there is content, set height to scrollHeight (capped at 200px)
      // If empty, remove inline height so CSS takes over (min-height)
      if (input.length > 0) {
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
      } else {
        textareaRef.current.style.height = '';
      }
    }
  }, [input]);

  const handleResetChat = () => {
    const isFullReset = window.confirm(t('chat.resetConfirm'));

    if (isFullReset) {
      setMessages([{
        id: 'welcome',
        role: 'system',
        content: t('chat.resetDone'),
        timestamp: Date.now()
      }]);
      setAttachment(null);
      if (onResetCV) {
        onResetCV();
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isPdf = file.type === 'application/pdf';
      const isImage = file.type.startsWith('image/');

      if (!isPdf && !isImage) {
        alert(t('chat.uploadError'));
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setAttachment({
        file,
        previewUrl,
        type: isPdf ? 'pdf' : 'image'
      });
    }
  };

  const clearAttachment = () => {
    if (attachment) {
      URL.revokeObjectURL(attachment.previewUrl);
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if ((!input.trim() && !attachment) || isLoading) return;
    if (!apiKey) {
      onRequestApiKey();
      return;
    }

    const currentAttachment = attachment;

    // Prepare User Message
    let userDisplayContent = input;
    if (currentAttachment) {
      userDisplayContent = input ? input : `${t('chat.analyzed')} ${currentAttachment.file.name}`;
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userDisplayContent,
      timestamp: Date.now()
    };

    // Update UI immediately
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setAttachment(null); // Clear attachment from UI immediately
    setIsLoading(true);

    try {
      let payloadAttachment: FileAttachment | undefined = undefined;

      if (currentAttachment) {
        const reader = new FileReader();
        const base64Data = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(currentAttachment.file);
        });

        payloadAttachment = {
          base64: base64Data,
          mimeType: currentAttachment.file.type
        };
      }

      // Call Agent Service with selected model
      const response = await chatWithCVAgent(
        apiKey,
        selectedModel,
        newMessage.content,
        currentResumeData,
        messages,
        payloadAttachment
      );

      console.log("AI Response Received:", response);

      onUpdateResume(response.updatedResume);

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.chatResponse,
        thoughts: response.thoughts,
        timestamp: Date.now()
      }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: t('chat.error'),
        timestamp: Date.now()
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

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Minimal Header */}
      <div className="px-6 py-4 flex items-center justify-between z-10 bg-white/80 backdrop-blur-md sticky top-0 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onRequestApiKey}>
            <span className="text-lg font-semibold text-slate-700 tracking-tight">Gemini</span>
          </div>

          {/* Model Selector */}
          <div className="relative group">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as GeminiModel)}
              className="appearance-none bg-slate-100 hover:bg-slate-200 pl-7 pr-8 py-1.5 rounded-full text-[10px] font-bold text-slate-600 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer transition-colors uppercase tracking-wider"
            >
              <option value="gemini-3-flash-preview">Gemini 3 Flash</option>
              <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
              <option value="gemini-flash-latest">Gemini Flash (Latest)</option>
              <option value="gemini-flash-lite-latest">Gemini Flash Lite (Latest)</option>
            </select>
            <Sparkles className="w-3 h-3 text-indigo-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
          title={t('chat.newChat')}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-8 scroll-smooth">
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={`flex flex-col w-full max-w-3xl mx-auto group ${idx === 0 ? 'mt-4' : ''}`}
          >
            {/* Thinking Process Block */}
            {msg.thoughts && (
              <div className="pl-4 mb-2">
                <ThoughtBlock thoughts={msg.thoughts} />
              </div>
            )}

            <div className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user'
                ? 'bg-slate-200'
                : 'bg-gradient-to-tr from-blue-500 to-indigo-500'
                }`}>
                {msg.role === 'user' ? (
                  <span className="text-xs font-bold text-slate-600">{t('chat.you')}</span>
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Content */}
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {/* Name */}
                <div className="text-xs font-medium text-slate-400 mb-1 px-1">
                  {msg.role === 'user' ? t('chat.you') : 'Gemini'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>

                {/* Bubble */}
                <div className={`
                        inline-block text-sm leading-7 py-3 px-5 rounded-2xl shadow-sm
                        ${msg.role === 'user'
                    ? 'bg-slate-100 text-slate-800 rounded-tr-sm'
                    : 'bg-white text-slate-800 border border-blue-100 rounded-tl-sm ring-1 ring-slate-100/50'
                  }
                    `}>
                  <MarkdownRenderer content={msg.content} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="max-w-3xl mx-auto pl-12">
            <div className="flex items-center gap-2 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs font-medium animate-pulse">{t('chat.analyzing', { model: selectedModel.replace('gemini-', '') })}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Modern Input Area */}
      <div className="p-3 md:p-6 bg-white sticky bottom-0 z-20">
        <div className="max-w-3xl mx-auto flex flex-col gap-2">

          {/* Attachment Badge (Stacked above input) */}
          {attachment && (
            <div className="self-start flex items-center gap-3 bg-white border border-slate-200 p-2 pr-3 rounded-xl shadow-sm animate-in slide-in-from-bottom-2 fade-in duration-200 w-fit mb-1">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0 border border-indigo-100">
                {attachment.type === 'image' ? (
                  <img src={attachment.previewUrl} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <FileText className="w-5 h-5 text-indigo-600" />
                )}
              </div>
              <div className="flex flex-col min-w-[100px] max-w-[200px]">
                <span className="text-xs font-semibold text-slate-700 truncate">{attachment.file.name}</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{attachment.type} FILE</span>
              </div>
              <button
                onClick={clearAttachment}
                className="ml-2 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                title="Remove attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* The Capsule Input */}
          <div className={`
                flex items-end gap-2 bg-slate-100/80 backdrop-blur-sm p-1.5 md:p-2 rounded-[2rem] border border-slate-200 transition-all duration-200
                focus-within:bg-white focus-within:border-slate-500 focus-within:ring-0 focus-within:shadow-md
            `}>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,application/pdf"
              onChange={handleFileSelect}
            />

            {/* Plus Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 md:p-3 mb-[2px] text-slate-500 hover:bg-slate-200 rounded-full transition-colors shrink-0 focus:outline-none"
              title="Upload CV (PDF/Image)"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Text Area */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t('chat.placeholder')}
              className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none text-base py-2 md:py-3 px-1 text-slate-700 placeholder-slate-400 min-h-[40px] md:min-h-[48px] max-h-[200px] resize-none custom-scrollbar leading-normal ${input ? 'overflow-y-auto' : 'overflow-hidden'}`}
              rows={1}
            />

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={isLoading || (!input.trim() && !attachment)}
              className={`
                        p-2 md:p-3 mb-[2px] rounded-full transition-all duration-200 shrink-0 flex items-center justify-center focus:outline-none
                        ${(!input.trim() && !attachment) || isLoading
                  ? 'bg-transparent text-slate-300 cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-black shadow-md hover:scale-105 active:scale-95'
                }
                    `}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUp className="w-5 h-5" />}
            </button>
          </div>

          <div className="text-[10px] text-center text-slate-400 font-medium hidden md:block">
            {t('chat.disclaimer')}
          </div>
        </div>
      </div>
    </div>
  );
};

const ThoughtBlock: React.FC<{ thoughts: string }> = ({ thoughts }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-indigo-500 transition-colors uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md border border-slate-100"
      >
        <BrainCircuit className="w-3 h-3" />
        <span>{t('chat.thinking', 'Thinking Process')}</span>
        {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>

      {isOpen && (
        <div className="mt-2 bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-600 leading-relaxed font-mono shadow-inner animate-in slide-in-from-top-1">
          <MarkdownRenderer content={thoughts} />
        </div>
      )}
    </div>
  );
};

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const formatText = (text: string) => {
    const paragraphs = text.split(/\n\n+/);
    return paragraphs.map((paragraph, pIdx) => {
      if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
        const listItems = paragraph.split(/\n/).filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '));
        return (
          <ul key={pIdx} className="list-disc ml-5 mb-3 space-y-1.5 text-slate-700">
            {listItems.map((item, i) => (
              <li key={i}>{parseInline(item.replace(/^[-*]\s+/, ''))}</li>
            ))}
          </ul>
        );
      }
      return <p key={pIdx} className="mb-3 last:mb-0 text-slate-700">{parseInline(paragraph)}</p>;
    });
  };

  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return <>{formatText(content)}</>;
};

export default ChatAssistant;