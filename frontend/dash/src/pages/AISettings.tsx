import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { ChevronDown, CheckCircle2, XCircle, RefreshCw, Eye, Trash2, Bot, User, Send } from 'lucide-react';
import { useChatbot } from '../context/ChatbotContext';
import { apiFetch, apiJson } from '../utils/api';

export const AISettings: React.FC = () => {
    const { selectedChatbot } = useChatbot();
    
    const [aiConfig, setAiConfig] = useState({
        provider: 'gemini',
        model: 'gemini/gemini-2.5-flash',
        api_key: '',
        system_instruction: `You are a helpful AI assistant for ${selectedChatbot?.name || ''}.`
    });
    const [hasKey, setHasKey] = useState(false);
    
    const [aiTesting, setAiTesting] = useState(false);
    const [aiSaving, setAiSaving] = useState(false);
    const [aiTestResult, setAiTestResult] = useState<{success: boolean, message: string} | null>(null);
    const [aiSaveResult, setAiSaveResult] = useState<{success: boolean, message: string} | null>(null);
    const [chatLoading, setChatLoading] = useState(false);

    const [messages, setMessages] = useState([
        { role: 'bot', text: `Hello! I'm your ${selectedChatbot?.name || ''} assistant. How can I help you today?` }
    ]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const fetchAiSettings = async () => {
            try {
                const res = await apiFetch('/api/ai/settings');
                if (res.ok) {
                    const data = await res.json();
                    setAiConfig({
                        provider: data.provider || 'gemini',
                        model: data.model || 'gemini/gemini-2.5-flash',
                        api_key: '', // Avoid putting real key here
                        system_instruction: data.system_instruction || `You are a helpful AI assistant for ${selectedChatbot?.name || ''}.`
                    });
                    setHasKey(data.has_key);
                }
            } catch (err) {
                console.error("Failed to fetch AI settings", err);
            }
        };
        fetchAiSettings();
    }, [selectedChatbot]);

    const handleValidate = async () => {
        setAiTesting(true);
        setAiTestResult(null);
        try {
            const res = await apiJson('/api/ai/test', 'POST', aiConfig);
            const data = await res.json();
            setAiTestResult({ success: data.success, message: data.message || data.error });
            setTimeout(() => setAiTestResult(null), 3000);
        } catch (err: any) {
            setAiTestResult({ success: false, message: err.message || 'Network error' });
        } finally {
            setAiTesting(false);
        }
    };

    const handleSave = async () => {
        setAiSaving(true);
        setAiSaveResult(null);
        try {
            const res = await apiJson('/api/ai/save', 'POST', aiConfig);
            const data = await res.json();
            setAiSaveResult({ success: data.success || res.ok, message: data.message || data.error || 'Saved successfully' });
            
            if (data.success || res.ok) {
                if (aiConfig.api_key) setHasKey(true);
                setAiConfig({...aiConfig, api_key: ''}); // Clear the UI after save
            }
            
            setTimeout(() => setAiSaveResult(null), 3000);
        } catch (err: any) {
            setAiSaveResult({ success: false, message: err.message || 'Network error' });
        } finally {
            setAiSaving(false);
        }
    };

    const handleClearChat = () => {
        setMessages([{ role: 'bot', text: `Hello! I'm your ${selectedChatbot?.name || ''} assistant. How can I help you today?` }]);
    };

    const handleSendMessage = async () => {
        if (!input.trim() || chatLoading) return;
        
        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setChatLoading(true);
        
        try {
            const res = await apiJson('/api/chat', 'POST', {
                    message: userMsg,
                    session_id: 'preview_session_123',
            });
            const data = await res.json();
            
            if (data.handoff) {
                setMessages(prev => [...prev, { role: 'bot', text: "[Human Handoff Requested] " + (data.reply || "") }]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', text: data.reply || "No response." }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', text: "Error: Could not reach the server." }]);
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <MainLayout title={`AI Settings: ${selectedChatbot?.name || ''}`} showBreadcrumbs={true}>
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
                                        <select 
                                            value={aiConfig.provider}
                                            onChange={(e) => setAiConfig({...aiConfig, provider: e.target.value})}
                                            className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 font-body-base text-body-base text-text-primary [color-scheme:dark]"
                                        >
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
                                        <select 
                                            value={aiConfig.model}
                                            onChange={(e) => setAiConfig({...aiConfig, model: e.target.value})}
                                            className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 font-body-base text-body-base text-text-primary [color-scheme:dark]"
                                        >
                                            <option value="gemini/gemini-2.5-flash">Gemini 2.5 Flash</option>
                                            <option value="gemini/gemini-2.5-pro">Gemini 2.5 Pro</option>
                                            <option value="openai/gpt-4o">GPT-4o</option>
                                            <option value="anthropic/claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block font-label-sm text-sm text-text-muted">
                                        API Key {hasKey && <span className="text-emerald-400 text-xs ml-2">(Key is configured)</span>}
                                    </label>
                                    <button type="button" className="font-label-sm text-sm text-primary hover:text-primary-fixed transition-colors duration-300">Get API Key</button>
                                </div>
                                <input 
                                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 font-body-base text-body-base text-text-primary placeholder:text-text-muted/50" 
                                    placeholder={hasKey ? "Leave blank to keep existing key" : "Enter your provider API key"}
                                    type="password" 
                                    value={aiConfig.api_key}
                                    onChange={(e) => setAiConfig({...aiConfig, api_key: e.target.value})}
                                />
                            </div>

                            <div className="flex-1 flex flex-col">
                                <label className="block font-label-sm text-sm text-text-muted mb-2">System Prompt / Instructions</label>
                                <textarea 
                                    className="flex-1 min-h-[150px] w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 font-body-base text-body-base text-text-primary placeholder:text-text-muted/50 resize-none" 
                                    placeholder="You are a helpful AI assistant..."
                                    value={aiConfig.system_instruction}
                                    onChange={(e) => setAiConfig({...aiConfig, system_instruction: e.target.value})}
                                />
                            </div>

                            {/* Validation & Save Footer */}
                            <div className="flex justify-between items-center pt-6 border-t border-border-subtle mt-auto">
                                <div className="flex gap-2">
                                    {aiTestResult && (
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${aiTestResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                            {aiTestResult.success ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                            <span className="font-label-sm text-sm">{aiTestResult.success ? 'Validated' : 'Failed'}</span>
                                        </div>
                                    )}
                                    {aiSaveResult && (
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${aiSaveResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                            {aiSaveResult.success ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                            <span className="font-label-sm text-sm">{aiSaveResult.success ? 'Saved' : 'Save Failed'}</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex gap-3">
                                    <button 
                                        type="button"
                                        onClick={handleValidate}
                                        disabled={aiTesting || (!aiConfig.api_key && !hasKey)}
                                        className="border border-border-subtle hover:bg-surface-glass-hover text-text-primary font-label-sm text-sm px-6 py-2.5 rounded-lg transition-all duration-300 shadow-sm flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <RefreshCw className={`w-[18px] h-[18px] ${aiTesting ? 'animate-spin' : ''}`} />
                                        {aiTesting ? 'Testing...' : 'Test Connection'}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={handleSave}
                                        disabled={aiSaving}
                                        className="bg-gradient-to-br from-indigo-500 to-violet-500 hover:opacity-90 text-white font-label-sm text-sm px-6 py-2.5 rounded-lg transition-all duration-300 shadow-indigo-500/20 shadow-lg flex items-center gap-2 -translate-y-0.5 hover:-translate-y-1 disabled:opacity-50 disabled:-translate-y-0"
                                    >
                                        {aiSaving ? 'Saving...' : 'Save Settings'}
                                    </button>
                                </div>
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
