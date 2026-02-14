import { X } from "lucide-react";

function AppModal({ show, title, children, onClose, size = "" }) {

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
                className={`modal-content-modern card-modern shadow-2xl animate-scale-in ${size}`}
                style={{
                    maxWidth: size === "lg" ? "800px" : size === "sm" ? "400px" : "500px",
                    width: "100%",
                    maxHeight: "90vh",
                    overflow: "auto",
                    padding: 0
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modern Header */}
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--bg-secondary)', borderBottomColor: 'var(--border-default) !important' }}>
                    <h5 className="modal-title fw-bold m-0" style={{ color: "var(--text-primary)" }}>
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

                {/* Body with padding */}
                <div className="p-4">
                    {children}
                </div>
            </div>

        </div>
    );
}

export default AppModal;
