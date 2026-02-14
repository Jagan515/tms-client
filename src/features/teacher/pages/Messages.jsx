import { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../components/common/PageHeader";
import AppModal from "../../../components/common/AppModal";
import Loading from "../../../components/common/Loading";
import messageService from "../api/messageService";
import FormInput from "../../../components/common/FormInput";
import {
    Inbox,
    Send,
    Trash2,
    Mail,
    Search,
    Plus,
    Reply,
    MoreVertical,
    User,
    Clock,
    Archive,
    Menu,
    Type
} from "lucide-react";

function Messages() {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('inbox');
    const [showCompose, setShowCompose] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Compose State
    const [recipientEmail, setRecipientEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        try {
            const data = activeTab === 'inbox'
                ? await messageService.getInbox()
                : await messageService.getSent();
            setMessages(data.messages || []);
            setSelectedMessage(null);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    }, [activeTab]);

    useEffect(() => { fetchMessages(); }, [fetchMessages]);

    const handleRead = async (msg) => {
        setSelectedMessage(msg);
        if (activeTab === 'inbox' && !msg.isRead) {
            try {
                await messageService.markRead(msg._id);
                setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
            } catch (err) { console.error(err); }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Move this conversation to archive?")) {
            try {
                await messageService.delete(id);
                setMessages(prev => prev.filter(m => m._id !== id));
                setSelectedMessage(null);
            } catch (err) { console.error(err); }
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await messageService.send({ recipientEmail, subject, body });
            setShowCompose(false);
            setRecipientEmail(""); setSubject(""); setBody("");
            if (activeTab === 'sent') fetchMessages();
        } catch {
            setLoading(false);
        }
        finally { setSending(false); }
    };

    const filteredMessages = messages.filter(msg =>
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activeTab === 'inbox' ? msg.senderId?.name : msg.recipientId?.name)?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && !showCompose && messages.length === 0) return <Loading text="Syncing mail server..." />;

    return (
        <div className="p-4 animate-fade-in" style={{ minHeight: '100vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <PageHeader
                    title="Communication Terminal"
                    subtitle="Institutional messaging and secure notifications hub"
                />
                <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2 shadow-lg hover-lift" onClick={() => setShowCompose(true)}>
                    <Plus size={18} />
                    <span>Secure Archive Compose</span>
                </button>
            </div>

            <div className="card-modern shadow-2xl border-0 overflow-hidden d-flex flex-column flex-lg-row" style={{ minHeight: '700px', backgroundColor: 'var(--bg-secondary)' }}>
                {/* Sidebar Navigation */}
                <div className="border-end bg-tertiary" style={{ width: '320px', backgroundColor: 'var(--bg-tertiary)' }}>
                    <div className="p-4">
                        <div className="nav-pill-container d-flex flex-column gap-1 mb-4">
                            <button
                                className={`btn text - start d - flex align - items - center gap - 3 px - 3 py - 2.5 rounded - 3 transition - all border - 0 ${activeTab === 'inbox' ? 'bg-primary text-white shadow-primary' : 'text-secondary hover-bg-secondary'} `}
                                onClick={() => setActiveTab('inbox')}
                            >
                                <Inbox size={20} />
                                <span className="fw-bold small">Direct Inbox</span>
                                <span className="ms-auto badge bg-white text-primary rounded-pill small">
                                    {messages.filter(m => !m.isRead).length}
                                </span>
                            </button>
                            <button
                                className={`btn text - start d - flex align - items - center gap - 3 px - 3 py - 2.5 rounded - 3 transition - all border - 0 ${activeTab === 'sent' ? 'bg-primary text-white shadow-primary' : 'text-secondary hover-bg-secondary'} `}
                                onClick={() => setActiveTab('sent')}
                            >
                                <Send size={20} />
                                <span className="fw-bold small">Transmitted Mail</span>
                            </button>
                        </div>

                        <div className="position-relative mb-4">
                            <Search className="position-absolute top-50 translate-middle-y ms-3 text-muted opacity-50" size={16} />
                            <input
                                className="form-control ps-5 rounded-3 border-0 bg-secondary shadow-none small"
                                placeholder="Locate session..."
                                style={{ fontSize: '0.85rem' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="message-list overflow-auto" style={{ maxHeight: '500px' }}>
                        {filteredMessages.length === 0 ? (
                            <div className="p-5 text-center text-muted opacity-50">
                                <Archive size={40} className="mb-3 d-block mx-auto" />
                                <div className="small fw-bold">Zero records detected</div>
                            </div>
                        ) : filteredMessages.map(msg => (
                            <div
                                key={msg._id}
                                className={`p - 4 cursor - pointer transition - all border - bottom border - secondary - subtle hover - bg - secondary ${selectedMessage?._id === msg._id ? 'bg-secondary border-start-primary' : ''} ${!msg.isRead && activeTab === 'inbox' ? 'bg-primary-subtle' : ''} `}
                                onClick={() => handleRead(msg)}
                                style={{ borderLeft: selectedMessage?._id === msg._id ? '4px solid var(--brand-primary)' : '4px solid transparent' }}
                            >
                                <div className="d-flex justify-content-between align-items-start mb-1">
                                    <div className="fw-bold small text-truncate" style={{ maxWidth: '180px' }}>
                                        {activeTab === 'inbox' ? (msg.senderId?.name || 'Authorized identity') : (msg.recipientId?.name || 'Target recipient')}
                                    </div>
                                    <div className="text-muted" style={{ fontSize: '0.65rem' }}>
                                        {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                                <div className="small text-truncate fw-semibold text-primary mb-1">{msg.subject}</div>
                                <div className="text-secondary text-truncate small opacity-75">{msg.body}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-grow-1 bg-secondary animate-fade-in" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    {selectedMessage ? (
                        <div className="d-flex flex-column h-100">
                            <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-tertiary" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-primary text-white p-2.5 rounded-circle shadow-sm">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <div className="fw-bold small text-uppercase letter-spacing-1 text-muted">Transmitting Entity</div>
                                        <div className="fw-bold">{activeTab === 'inbox' ? (selectedMessage.senderId?.name || selectedMessage.senderId?.email) : (selectedMessage.recipientId?.name || selectedMessage.recipientId?.email)}</div>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-icon rounded-circle hover-bg-tertiary" onClick={() => handleDelete(selectedMessage._id)}>
                                        <Trash2 size={18} className="text-danger" />
                                    </button>
                                    <button className="btn btn-sm btn-icon rounded-circle hover-bg-tertiary">
                                        <MoreVertical size={18} className="text-secondary" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-5 flex-grow-1 overflow-auto">
                                <div className="d-flex justify-content-between align-items-start mb-5">
                                    <h3 className="fw-bold tracking-tight mb-0">{selectedMessage.subject}</h3>
                                    <div className="d-flex align-items-center gap-2 text-muted small bg-tertiary px-3 py-1 rounded-pill">
                                        <Clock size={14} />
                                        <span>Authenticated: {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="message-body text-secondary" style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
                                    {selectedMessage.body}
                                </div>
                            </div>

                            <div className="p-4 border-top bg-tertiary d-flex gap-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                {activeTab === 'inbox' && (
                                    <button className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-sm" onClick={() => {
                                        setRecipientEmail(selectedMessage.senderId?.email || "");
                                        setSubject(`RE: ${selectedMessage.subject} `);
                                        setShowCompose(true);
                                    }}>
                                        <Reply size={18} />
                                        <span className="fw-bold small">Direct Response</span>
                                    </button>
                                )}
                                <button className="btn btn-outline-secondary rounded-pill px-4 py-2 border-dashed fw-bold small">
                                    Archive Conversation
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-100 d-flex align-items-center justify-content-center border-start">
                            <div className="text-center p-5">
                                <div className="bg-tertiary p-5 rounded-circle d-inline-block mb-4 shadow-sm">
                                    <Mail size={80} className="text-primary opacity-20" />
                                </div>
                                <h4 className="fw-bold text-secondary mb-2">Encrypted Communication Vault</h4>
                                <p className="text-muted small mx-auto" style={{ maxWidth: '300px' }}>Select an institutional transmission from the ledger to decrypt and display.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AppModal show={showCompose} title="Compose Secure Transmission" onClose={() => setShowCompose(false)}>
                <form onSubmit={handleSend} className="animate-fade-in">
                    <FormInput
                        label="Validated Recipient"
                        type="email"
                        icon={Mail}
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        required
                        placeholder="identity@institution.edu"
                    />
                    <FormInput
                        label="Transmission Subject"
                        icon={Type}
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        placeholder="Priority: Operational Sync"
                    />
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-muted text-uppercase mb-2 px-1 letter-spacing-1">Secure Message Body</label>
                        <textarea
                            className="form-control rounded-3 border-secondary-subtle bg-tertiary bg-tertiary-hover transition-all"
                            rows="6"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            required
                            placeholder="Type your message..."
                            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                        ></textarea>
                    </div>
                    <div className="d-flex flex-column gap-2 mt-5">
                        <button type="submit" className="btn btn-primary py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-lg" disabled={sending}>
                            {sending ? (
                                <div className="spinner-border spinner-border-sm" role="status"></div>
                            ) : (
                                <>
                                    <Send size={18} />
                                    <span>Initiate Transimission</span>
                                </>
                            )}
                        </button>
                        <button type="button" className="btn btn-link py-2 text-decoration-none text-muted small fw-bold" onClick={() => setShowCompose(false)}>
                            Discard Metadata
                        </button>
                    </div>
                </form>
            </AppModal>

        </div>
    );
}

export default Messages;
