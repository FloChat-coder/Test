import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { User, Bot, CreditCard, ChevronDown, CheckCircle2, Copy, Eye, EyeOff, Plus, Cpu, AlertCircle, Trash2 } from 'lucide-react';
import { useChatbot } from '../context/ChatbotContext';
import { apiFetch, apiJson } from '../utils/api';

export const Settings: React.FC = () => {
    const { chatbots, selectedChatbot, setSelectedChatbot, refreshBots } = useChatbot();
    const [copiedSnippet, setCopiedSnippet] = useState(false);
    const [activeSection, setActiveSection] = useState('account');
    const [showPassword, setShowPassword] = useState(false);

    // Account State
    const [account, setAccount] = useState({ name: '', email: '', password: '' });
    const [accountSaving, setAccountSaving] = useState(false);

    // Bot State
    const [botName, setBotName] = useState('');
    const [botTheme, setBotTheme] = useState('indigo');
    const [botSaving, setBotSaving] = useState(false);

    // Billing State
    const [billing, setBilling] = useState<any>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -60% 0px' }
        );

        const sections = ['account', 'bots', 'billing'];
        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (selectedChatbot) {
            setBotName(selectedChatbot.name);
            setBotTheme(selectedChatbot.theme_color);
        }
    }, [selectedChatbot]);

    useEffect(() => {
        apiFetch('/api/settings/account')
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setAccount(prev => ({ ...prev, name: data.name, email: data.email }));
                }
            })
            .catch(console.error);
        apiFetch('/api/settings/billing')
            .then(res => res.json())
            .then(data => {
                if (!data.error) setBilling(data);
            })
            .catch(console.error);
    }, []);

    const handleCopy = () => {
        setCopiedSnippet(true);
        setTimeout(() => setCopiedSnippet(false), 2000);
    };

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const saveAccount = async () => {
        setAccountSaving(true);
        try {
            await apiJson('/api/settings/account', 'PUT', account);
            setAccount(prev => ({ ...prev, password: '' }));
        } catch (e) {
            console.error(e);
        }
        setAccountSaving(false);
    };

    const saveBot = async () => {
        if (!selectedChatbot) return;
        setBotSaving(true);
        try {
            await apiJson(`/api/settings/bots/${selectedChatbot.id}`, 'PUT', { name: botName, theme_color: botTheme });
            refreshBots();
        } catch (e) {
            console.error(e);
        }
        setBotSaving(false);
    };
    
    const deleteBot = async () => {
        if (!selectedChatbot) return;
        if (!confirm(`Are you sure you want to delete ${selectedChatbot.name}?`)) return;
        try {
            await apiJson(`/api/settings/bots/${selectedChatbot.id}`, 'DELETE');
            refreshBots();
        } catch (e) {
            console.error(e);
        }
    };
    
    const createBot = async () => {
        try {
            await apiJson('/api/settings/bots', 'POST', { name: 'New Bot' });
            refreshBots();
        } catch (e) {
            console.error(e);
        }
    };

    const toggleAutoRenew = async () => {
        if (!billing) return;
        const newVal = !billing.auto_renew;
        setBilling({ ...billing, auto_renew: newVal });
        try {
            await apiJson('/api/settings/billing/auto-renew', 'PUT', { auto_renew: newVal });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <MainLayout title="Settings" showBreadcrumbs={true}>
            <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 relative pb-20">

                {/* Secondary Sidebar (Quick Nav) */}
                <div className="col-span-12 md:col-span-3">
                    <div className="sticky top-[96px] flex flex-col gap-2">
                        <h2 className="font-heading-md text-heading-md text-text-primary mb-4 tracking-tight">Settings</h2>

                        <button
                            onClick={() => scrollToSection('account')}
                            className={`px-4 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-3 w-full text-left font-body-base ${activeSection === 'account'
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-text-muted hover:bg-surface-glass-hover hover:text-text-primary'
                                }`}
                        >
                            <User className="w-[20px] h-[20px]" />
                            Profile & Account
                        </button>

                        <button
                            onClick={() => scrollToSection('bots')}
                            className={`px-4 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-3 w-full text-left font-body-base ${activeSection === 'bots'
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-text-muted hover:bg-surface-glass-hover hover:text-text-primary'
                                }`}
                        >
                            <Bot className="w-[20px] h-[20px]" />
                            Bot & Widget Management
                        </button>

                        <button
                            onClick={() => scrollToSection('billing')}
                            className={`px-4 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-3 w-full text-left font-body-base ${activeSection === 'billing'
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-text-muted hover:bg-surface-glass-hover hover:text-text-primary'
                                }`}
                        >
                            <CreditCard className="w-[20px] h-[20px]" />
                            Billing & Plans
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="col-span-12 md:col-span-9 space-y-12">

                    {/* ACCOUNT PROFILE */}
                    <div id="account" className="bg-surface-glass backdrop-blur-xl border border-border-subtle rounded-xl p-8 shadow-lg scroll-mt-[96px]">
                        <h3 className="font-heading-md text-heading-md tracking-tight text-text-primary mb-6">Account Profile</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
                                <input
                                    className="w-full bg-surface-container-low border border-border-subtle text-text-primary rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 placeholder:text-text-muted/50"
                                    type="text"
                                    value={account.name}
                                    onChange={(e) => setAccount({ ...account, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Email Address</label>
                                <input
                                    className="w-full bg-surface-container-low border border-border-subtle text-text-primary rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 placeholder:text-text-muted/50"
                                    type="email"
                                    value={account.email}
                                    onChange={(e) => setAccount({ ...account, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Password</label>
                                <div className="flex gap-4 items-center">
                                    <div className="relative flex-1">
                                        <input
                                            className="w-full bg-surface-container-low border border-border-subtle text-text-primary rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 placeholder:text-text-muted/50"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter new password to change..."
                                            value={account.password}
                                            onChange={(e) => setAccount({ ...account, password: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4 border-t border-border-subtle">
                            <button 
                                onClick={saveAccount}
                                disabled={accountSaving}
                                className="bg-gradient-to-br from-indigo-500 to-violet-500 hover:opacity-90 text-white font-label-sm px-6 py-2.5 rounded-lg transition-all duration-300 shadow-indigo-500/20 shadow-lg"
                            >
                                {accountSaving ? 'Saving...' : 'Save Account Changes'}
                            </button>
                        </div>
                    </div>

                    {/* BOT AND WIDGET MANAGEMENT */}
                    <div id="bots" className="bg-surface-glass backdrop-blur-xl border border-border-subtle rounded-xl p-8 shadow-lg scroll-mt-[96px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-heading-md text-heading-md tracking-tight text-text-primary">Bots & Widget Management</h3>
                            <button 
                                onClick={saveBot}
                                disabled={botSaving || !selectedChatbot}
                                className="bg-gradient-to-br from-indigo-500 to-violet-500 hover:opacity-90 text-white font-label-sm px-6 py-2.5 rounded-lg transition-all duration-300 shadow-indigo-500/20 shadow-lg flex items-center gap-2"
                            >
                                {botSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>

                        {/* Bot List */}
                        <div className="flex gap-4 overflow-x-auto pb-6 mb-6 border-b border-border-subtle scrollbar-none">
                            {chatbots.map((bot) => (
                                <div
                                    key={bot.id}
                                    onClick={() => setSelectedChatbot(bot)}
                                    className={`min-w-[240px] border rounded-xl p-5 cursor-pointer transition-all duration-300 shadow-lg relative overflow-hidden group ${bot.id === selectedChatbot?.id
                                            ? 'bg-white/[0.08] border-primary/30 shadow-indigo-500/10 hover:-translate-y-1'
                                            : 'bg-surface-glass border-border-subtle hover:-translate-y-1 hover:bg-surface-glass-hover'
                                        }`}>
                                    {bot.id === selectedChatbot?.id && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-br from-indigo-500 to-violet-500"></div>}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bot.id === selectedChatbot?.id ? 'bg-primary/20 text-primary' : 'bg-surface-container-high text-text-muted group-hover:text-primary transition-colors'}`}>
                                            <Bot className="w-5 h-5" />
                                        </div>
                                        {bot.status === 'Active' ? (
                                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold tracking-wider uppercase border border-emerald-500/20">Active</span>
                                        ) : (
                                            <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-text-muted text-[11px] font-bold tracking-wider uppercase border border-border-subtle">Draft</span>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-text-primary mb-1 truncate">{bot.name}</h4>
                                    <p className="text-text-muted text-xs">Created {bot.created_at}</p>
                                </div>
                            ))}

                            <div 
                                onClick={createBot}
                                className="min-w-[240px] border border-border-subtle border-dashed rounded-xl p-5 cursor-pointer transition-all duration-300 hover:bg-surface-glass hover:border-primary/50 flex flex-col items-center justify-center text-text-muted hover:text-primary min-h-[140px]"
                            >
                                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <span className="font-label-sm font-medium">Create New Bot</span>
                            </div>
                        </div>

                        {/* Widget Config Form */}
                        {selectedChatbot && (
                            <div>
                                <h4 className="font-label-sm text-sm tracking-tight text-on-surface mb-6">Editing: <span className="text-primary">{selectedChatbot.name}</span> Widget Appearance</h4>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-text-muted mb-2">Rename Bot</label>
                                            <input
                                                className="w-full bg-surface-container-low border border-border-subtle text-text-primary rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                                                type="text"
                                                value={botName}
                                                onChange={(e) => setBotName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-muted mb-2">Widget Icon</label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg">
                                                    <Bot className="w-6 h-6" />
                                                </div>
                                                <button className="border border-border-subtle text-text-primary px-4 py-2 rounded-lg font-label-sm text-label-sm hover:bg-surface-glass-hover transition-all duration-300">Upload Custom Icon</button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-muted mb-2">Theme Color</label>
                                            <div className="flex gap-3">
                                                <button onClick={() => setBotTheme('indigo')} className={`w-8 h-8 rounded-full bg-[#6366f1] transition-transform ${botTheme === 'indigo' ? 'ring-2 ring-white ring-offset-2 ring-offset-bg-base' : 'hover:scale-110'}`}></button>
                                                <button onClick={() => setBotTheme('emerald')} className={`w-8 h-8 rounded-full bg-[#10b981] transition-transform ${botTheme === 'emerald' ? 'ring-2 ring-white ring-offset-2 ring-offset-bg-base' : 'hover:scale-110'}`}></button>
                                                <button onClick={() => setBotTheme('rose')} className={`w-8 h-8 rounded-full bg-[#f43f5e] transition-transform ${botTheme === 'rose' ? 'ring-2 ring-white ring-offset-2 ring-offset-bg-base' : 'hover:scale-110'}`}></button>
                                                <button onClick={() => setBotTheme('yellow')} className={`w-8 h-8 rounded-full bg-[#eab308] transition-transform ${botTheme === 'yellow' ? 'ring-2 ring-white ring-offset-2 ring-offset-bg-base' : 'hover:scale-110'}`}></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-text-muted mb-2">Embed Code</label>
                                        <div className="relative group">
                                            <pre className="bg-surface-container-highest p-4 rounded-xl border border-border-subtle text-xs text-text-muted overflow-x-auto h-48">
                                                <code>{`<script>
  window.floChatConfig = {
    botId: "${selectedChatbot.id}",
    theme: "${botTheme}",
    title: "${botName}"
  };
</script>
<script src="https://cdn.flochat.ai/widget.js" async></script>`}</code>
                                            </pre>
                                            <button
                                                onClick={handleCopy}
                                                className="absolute top-3 right-3 p-2 bg-surface-glass-hover rounded-lg text-text-primary transition-all duration-300 shadow-sm"
                                            >
                                                {copiedSnippet ? <CheckCircle2 className="w-[18px] h-[18px] text-emerald-400" /> : <Copy className="w-[18px] h-[18px]" />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-text-muted mt-2">Paste this snippet before the closing &lt;/body&gt; tag on your website.</p>
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-6 relative overflow-hidden">
                                    <div className="absolute left-0 top-0 h-full w-1 bg-red-500/50"></div>
                                    <h3 className="font-heading-md text-[18px] tracking-tight text-red-400 mb-2">Danger Zone</h3>
                                    <div className="flex justify-between items-center flex-wrap gap-4">
                                        <p className="text-sm text-text-muted max-w-lg">Permanently delete this bot and all its associated data. This action cannot be undone and will immediately break any active widget integrations.</p>
                                        <button 
                                            onClick={deleteBot}
                                            className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg font-label-sm text-label-sm hover:bg-red-500/20 transition-all duration-300"
                                        >
                                            Delete Bot
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* BILLING AND PLANS */}
                    {billing && (
                        <div id="billing" className="bg-surface-glass backdrop-blur-xl border border-border-subtle rounded-xl p-8 shadow-lg scroll-mt-[96px]">
                            <h3 className="font-heading-md text-heading-md tracking-tight text-text-primary mb-6">Billing & Plans</h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                <div className="bg-surface-container-low border border-border-subtle rounded-xl p-6">
                                    <h4 className="font-label-sm text-sm text-text-muted tracking-tight mb-4 uppercase">Current Plan</h4>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="font-display-xl text-[24px] text-text-primary tracking-tight">{billing.plan_name}</p>
                                            <p className="text-sm text-text-muted">10,000 Messages / mo</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-display-xl text-[24px] text-primary">${billing.price}</p>
                                            <p className="text-sm text-text-muted">/ month</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-lg font-label-sm text-sm hover:bg-primary/20 transition-colors">Upgrade</button>
                                        <button className="flex-1 border border-border-subtle text-text-muted px-4 py-2 rounded-lg font-label-sm text-sm hover:text-text-primary hover:bg-surface-glass transition-colors">Cancel</button>
                                    </div>
                                </div>

                                <div className="bg-surface-container-low border border-border-subtle rounded-xl p-6 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-label-sm text-sm text-text-muted tracking-tight mb-4 uppercase">Payment Method</h4>
                                        <div className="flex items-center gap-4 mb-4 bg-surface-glass border border-border-subtle p-3 rounded-lg">
                                            <div className="w-10 h-6 bg-surface-container-highest rounded border border-border-subtle flex items-center justify-center text-xs font-bold text-white">{billing.card_brand}</div>
                                            <div>
                                                <p className="text-sm text-text-primary">•••• •••• •••• {billing.card_last4}</p>
                                                <p className="text-xs text-text-muted">Expires {billing.card_exp}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-border-subtle pt-4">
                                        <p className="text-sm text-text-muted font-medium">Auto-renew subscription</p>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={billing.auto_renew} onChange={toggleAutoRenew} />
                                            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-heading-md text-[18px] text-text-primary">Payment History</h4>
                                    <div className="relative">
                                        <select className="bg-surface-container-low border border-border-subtle text-text-muted text-sm rounded-lg py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50">
                                            <option>Last 30 Days</option>
                                            <option>Last 3 Months</option>
                                            <option>2023</option>
                                            <option>Custom Range</option>
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                                    </div>
                                </div>

                                <div className="overflow-x-auto border border-border-subtle rounded-xl">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-surface-container-low border-b border-border-subtle text-xs text-text-muted uppercase tracking-wider">
                                                <th className="p-4 font-medium">Date</th>
                                                <th className="p-4 font-medium">Description</th>
                                                <th className="p-4 font-medium">Amount</th>
                                                <th className="p-4 font-medium">Status</th>
                                                <th className="p-4 font-medium text-right">Invoice</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {billing.invoices.map((inv: any, idx: number) => (
                                                <tr key={idx} className="border-b border-border-subtle bg-surface-glass last:border-0">
                                                    <td className="p-4 text-text-primary">{inv.date}</td>
                                                    <td className="p-4 text-text-muted">{inv.description}</td>
                                                    <td className="p-4 text-text-primary">${inv.amount.toFixed(2)}</td>
                                                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-surface-container-high text-text-muted'}`}>{inv.status}</span></td>
                                                    <td className="p-4 text-right"><button className="text-primary hover:underline">Download</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};
