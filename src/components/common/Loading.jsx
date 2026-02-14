import { Terminal } from "lucide-react";

function Loading({ text = "Synchronizing Institutional Matrix..." }) {
    return (
        <div className="vh-100 d-flex flex-column justify-content-center align-items-center animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="position-relative mb-5 animate-scale-in">
                {/* Modern Sophisticated Spinner */}
                <div className="institutional-spinner">
                    <div className="spinner-ring ring-1" style={{ borderTopColor: 'var(--brand-primary)', animationDuration: '1.5s' }}></div>
                    <div className="spinner-ring ring-2" style={{ borderRightColor: 'var(--brand-primary)', width: '80%', height: '80%', top: '10%', left: '10%', animationDuration: '2s', animationDirection: 'reverse' }}></div>
                    <div className="spinner-ring ring-3" style={{ borderBottomColor: 'var(--brand-primary)', width: '60%', height: '60%', top: '20%', left: '20%', animationDuration: '1s' }}></div>
                    <div className="spinner-core d-flex align-items-center justify-content-center bg-primary text-white shadow-lg">
                        <Terminal size={24} />
                    </div>
                </div>
            </div>

            <div className="text-center">
                <h5 className="fw-bold tracking-tight text-secondary mb-2 letter-spacing-1">{text}</h5>
                <div className="d-flex gap-1 justify-content-center opacity-50">
                    <div className="loading-dot bg-primary"></div>
                    <div className="loading-dot bg-primary" style={{ animationDelay: '0.2s' }}></div>
                    <div className="loading-dot bg-primary" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
    );
}

export default Loading;
