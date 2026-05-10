import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { ChevronDown, CheckCircle2, XCircle, RefreshCw, Eye, Trash2, Bot, User, Send } from 'lucide-react';
import { useChatbot } from '../context/ChatbotContext';

export const AISettings: React.FC = () => {
    const { selectedChatbot } = useChatbot();
    const [validationState, setValidationState] = useState<'idle' | 'validated' | 'failed'>('idle');
    const [messages, setMessages] = useState([
        { role: 'bot', text: `Hello! I'm your ${selectedChatbot} assistant. How can I help you today?` },
        { role: 'user', text: "Can you help me?" }
    ]);
    const [input, setInput] = useState('');
    const [systemPrompt, setSystemPrompt] = useState(`You are a helpful AI assistant for ${selectedChatbot}...`);
    const [apiKey, setApiKey] = useState('************************');

    // Reset settings when chatbot changes
    useEffect(() => {
        setMessages([
            { role: 'bot', text: `Hello! I'm your ${selectedChatbot} assistant. How can I help you today?` },
            { role: 'user', text: "Can you help me?" }
        ]);
        setSystemPrompt(`You are a helpful AI assistant for ${selectedChatbot}. Be professional and concise.`);
        setValidationState('idle');
    }, [selectedChatbot]);

    const handleValidate = () => {
        // Simulate validation
        setValidationState('validated');
    };

    const handleClearChat = () => {
        setMessages([{ role: 'bot', text: `Hello! I'm your ${selectedChatbot} assistant. How can I help you today?` }]);
    };

    const handleSendMessage = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, { role: 'user', text: input }]);
        setInput('');
        
        // Simulate bot reply
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'bot', text: "I'm a preview bot. I can't actually respond to real queries right now, but your setup looks great!" }]);
        }, 1000);
    };

    return (
        <MainLayout title={`AI Settings: ${selectedChatbot}`} showBreadcrumbs={true}>
            <div className="max-w-[1600px] mx-auto pb-8">
                <div className="mb-8">
                    <p className="font-body-base text-body-base text-text-muted">Configure your intelligent agent and test interactions in real-time.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
                    {/* Left Column: AI Settings */}
                    <div className="bg-surface-glass backdrop-blur-xl border border-border-subtle rounded-xl p-8 flex flex-col h-full shadow-lg">
                        <div className="mb-8">
                            <h2 className="font-heading-md text-heading-md tracking-tight mb-1 text-on-surface text-text-primary">Model Configuration</h2>
                            <p className="font-body-base text-body-base text-text-muted text-sm">Select and tune your AI provider.</p>
                        </div>

                        {/* AI Settings Form */}
                        <form className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-surface-variant scrollbar-track-transparent">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-label-sm text-sm text-text-muted mb-2">AI Provider</label>
                                    <div className="relative">
                                        <select className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 font-body-base text-body-base text-text-primary [color-scheme:dark]">
                                            <option value="gemini">Gemini</option>
                                            <option value="claude">Claude</option>
                                            <option value="openai">OpenAI</option>
                                            <option value="deepseek">DeepSeek</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none w-5 h-5" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-label-sm text-sm text-text-muted mb-2">Model Selection</label>
                                    <div className="relative">
                                        <select className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 font-body-base text-body-base text-text-primary [color-scheme:dark]">
                                            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                                            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block font-label-sm text-sm text-text-muted">API Key</label>
                                    <button type="button" className="font-label-sm text-sm text-primary hover:text-primary-fixed transition-colors duration-300">Get API Key</button>
                                </div>
                                <input 
                                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 font-body-base text-body-base text-text-primary placeholder:text-text-muted/50" 
                                    placeholder="Enter your provider API key" 
                                    type="password" 
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                />
                            </div>

                            <div className="flex-1 flex flex-col">
                                <label className="block font-label-sm text-sm text-text-muted mb-2">System Prompt / Instructions</label>
                                <textarea 
                                    className="flex-1 min-h-[150px] w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 font-body-base text-body-base text-text-primary placeholder:text-text-muted/50 resize-none" 
                                    placeholder="You are a helpful AI assistant..."
                                    value={systemPrompt}
                                    onChange={(e) => setSystemPrompt(e.target.value)}
                                />
                            </div>

                            {/* Validation Footer */}
                            <div className="flex justify-end items-center gap-4 pt-6 border-t border-border-subtle mt-auto">
                                {validationState === 'validated' && (
                                    <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="font-label-sm text-sm">Validated</span>
                                    </div>
                                )}
                                {validationState === 'failed' && (
                                    <div className="flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-full">
                                        <XCircle className="w-4 h-4" />
                                        <span className="font-label-sm text-sm">Not Validated</span>
                                    </div>
                                )}
                                <button 
                                    type="button"
                                    onClick={handleValidate}
                                    className="bg-gradient-to-br from-indigo-500 to-violet-500 hover:opacity-90 text-white font-label-sm text-sm px-6 py-2.5 rounded-lg transition-all duration-300 shadow-indigo-500/20 shadow-lg flex items-center gap-2 -translate-y-0.5 hover:-translate-y-1"
                                >
                                    <RefreshCw className="w-[18px] h-[18px]" />
                                    Validate Connection
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Live Chat Preview */}
                    <div className="bg-surface-glass backdrop-blur-xl border border-border-subtle rounded-xl p-8 flex flex-col h-full shadow-lg">
                        <div className="flex justify-between items-center mb-6 pb-6 border-b border-border-subtle shrink-0">
                            <h2 className="font-heading-md text-heading-md tracking-tight text-text-primary flex items-center gap-2">
                                <Eye className="text-primary w-5 h-5" />
                                Live Preview
                            </h2>
                            <button 
                                onClick={handleClearChat}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-subtle text-text-muted hover:bg-surface-glass-hover hover:text-text-primary transition-all duration-300 font-label-sm text-sm"
                            >
                                <Trash2 className="w-[16px] h-[16px]" />
                                Clear Chat
                            </button>
                        </div>

                        {/* Chat Preview Canvas */}
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-6 scrollbar-thin scrollbar-thumb-surface-variant scrollbar-track-transparent">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex items-start gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                        msg.role === 'bot' 
                                            ? 'bg-gradient-to-br from-indigo-500 to-violet-500' 
                                            : 'bg-surface-container-high border border-border-subtle'
                                    }`}>
                                        {msg.role === 'bot' 
                                            ? <Bot className="text-white w-[16px] h-[16px]" />
                                            : <User className="text-text-primary w-[16px] h-[16px]" />
                                        }
                                    </div>
                                    <div className={`font-body-base text-body-base shadow-sm p-4 ${
                                        msg.role === 'bot'
                                            ? 'bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm text-text-primary shadow-indigo-500/5'
                                            : 'bg-indigo-600 rounded-2xl rounded-tr-sm text-white'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chat Input Box */}
                        <div className="relative pt-4 border-t border-border-subtle shrink-0">
                            <input 
                                className="w-full bg-surface-container-low border border-border-subtle rounded-xl pl-4 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300 font-body-base text-body-base text-text-primary placeholder:text-text-muted/50 shadow-inner" 
                                placeholder="Type a message to test..." 
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button 
                                onClick={handleSendMessage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 mt-2 w-10 h-10 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors duration-300"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
