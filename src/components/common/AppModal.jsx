import { X } from "lucide-react";

function AppModal({ show, title, children, onClose, size = "", width }) {

    if (!show) return null;

    return (
        <div
            className="modal-backdrop-modern d-flex align-items-center justify-content-center p-3 animate-fade-in"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(8px)",
                zIndex: "var(--z-modal)",
            }}
            onClick={onClose}
        >
            <div
                className={`modal-content-modern card-modern shadow-2xl animate-scale-in border-0 ${size}`}
                style={{
                    maxWidth: width || (size === "lg" ? "800px" : size === "sm" ? "400px" : "500px"),
                    width: "100%",
                    maxHeight: "95vh",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    padding: 0,
                    backgroundColor: 'var(--surface-card)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modern Header - Fixed */}
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center flex-shrink-0" style={{ backgroundColor: 'var(--bg-secondary)', borderBottomColor: 'var(--border-default) !important' }}>
                    <h5 className="modal-title fw-bold m-0 tracking-tight" style={{ color: "var(--text-primary)" }}>
                        {title}
                    </h5>
                    <button
                        className="btn btn-sm btn-icon rounded-circle hover-bg-tertiary transition-all p-1"
                        onClick={onClose}
                        style={{ border: 'none', background: 'none' }}
                    >
                        <X className="w-5 h-5 text-muted flex-shrink-0" />
                    </button>
                </div>

                {/* Content Area - Children manage their own scrolling */}
                <div className="flex-grow-1 overflow-hidden d-flex flex-column" style={{ minHeight: 0 }}>
                    {children}
                </div>
            </div>

        </div>
    );
}

export default AppModal;
