import { AlertTriangle, ShieldCheck, X } from "lucide-react";

function ConfirmModal({ show, title, message, onConfirm, onCancel, confirmText = "Confirm Action", type = "danger" }) {
    if (!show) return null;

    return (
        <div className="fixed-top w-100 h-100 d-flex align-items-center justify-content-center animate-fade-in" style={{ zIndex: 2000, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)' }}>
            <div className="card-modern shadow-2xl border-0 overflow-hidden animate-scale-in" style={{ maxWidth: '450px', width: '90%', backgroundColor: 'var(--bg-secondary)' }}>
                <div className={`p-4 border-bottom d-flex align-items-center gap-3 bg-${type}-subtle`} style={{ backgroundColor: type === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(79, 70, 229, 0.1)' }}>
                    <div className={`p-2 rounded-circle bg-${type} text-white shadow-sm d-flex align-items-center justify-content-center`}>
                        {type === 'danger' ? <AlertTriangle className="w-5 h-5 flex-shrink-0" /> : <ShieldCheck className="w-5 h-5 flex-shrink-0" />}
                    </div>
                    <h5 className="mb-0 fw-bold tracking-tight text-secondary" style={{ color: 'var(--text-primary)' }}>{title}</h5>
                    <button className="btn btn-icon ms-auto hover-bg-tertiary rounded-circle p-1 d-flex align-items-center justify-content-center" onClick={onCancel}>
                        <X className="w-5 h-5 text-muted flex-shrink-0" />
                    </button>
                </div>

                <div className="p-5">
                    <p className="mb-0 text-secondary" style={{ lineHeight: '1.6', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{message}</p>
                </div>

                <div className="p-4 border-top bg-tertiary d-flex justify-content-end gap-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <button className="btn btn-link text-decoration-none text-muted fw-bold small py-2 px-3" onClick={onCancel}>
                        Abstain
                    </button>
                    <button className={`btn btn-${type === 'danger' ? 'danger' : 'primary'} rounded-pill px-4 py-2 fw-bold shadow-lg hover-lift`} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>

        </div>
    );
}

export default ConfirmModal;
