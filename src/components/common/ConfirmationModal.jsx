import { AlertTriangle, CheckCircle } from "lucide-react";
import AppModal from "./AppModal";

function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger", // danger, success, warning
    isLoading = false,
    error = null
}) {
    const getIcon = () => {
        switch (variant) {
            case "danger":
                return <AlertTriangle className="w-12 h-12 text-danger mb-3 flex-shrink-0" />;
            case "warning":
                return <AlertTriangle className="w-12 h-12 text-warning mb-3 flex-shrink-0" />;
            case "success":
                return <CheckCircle className="w-12 h-12 text-success mb-3 flex-shrink-0" />;
            default:
                return <AlertTriangle className="w-12 h-12 text-primary mb-3 flex-shrink-0" />;
        }
    };

    const getBtnClass = () => {
        switch (variant) {
            case "danger": return "btn-danger";
            case "warning": return "btn-warning text-white";
            case "success": return "btn-success text-white";
            default: return "btn-primary";
        }
    };

    return (
        <AppModal show={isOpen} onClose={onClose} size="sm" title={title || "Confirm Action"}>
            <div className="text-center py-3">
                <div className={`d-inline-flex p-3 rounded-circle mb-3 bg-${variant}-subtle`}>
                    {getIcon()}
                </div>

                <h5 className="fw-bold mb-2">{title}</h5>
                <p className="text-muted mb-4 px-2">
                    {message || "Are you sure you want to proceed with this action?"}
                </p>

                {error && (
                    <div className="alert alert-danger small py-2 fw-medium border-0 shadow-sm mb-4 mx-2 text-start">
                        {error}
                    </div>
                )}

                <div className="d-flex justify-content-center gap-3 w-100">
                    <button
                        className="btn btn-light rounded-pill px-4"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`btn ${getBtnClass()} rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-x-2`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                        {confirmText}
                    </button>
                </div>
            </div>
        </AppModal>
    );
}

export default ConfirmationModal;
