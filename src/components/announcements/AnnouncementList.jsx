import { Megaphone, Trash2, Calendar, Users, ChevronRight } from "lucide-react";

function AnnouncementList({ announcements = [], onDelete }) {
    if (!announcements || announcements.length === 0) {
        return (
            <div className="text-center py-5 animate-fade-in">
                <div className="bg-tertiary d-inline-block p-4 rounded-circle mb-3">
                    <Megaphone className="w-10 h-10 text-muted opacity-50 flex-shrink-0" />
                </div>
                <p className="text-muted small fw-medium">The bulletin is currently empty.</p>
                <div className="text-muted opacity-50" style={{ fontSize: '0.75rem' }}>Important updates will appear here.</div>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column gap-3 animate-fade-in">
            {announcements.map((item) => (
                <div key={item._id} className="p-3.5 rounded-4 bg-tertiary-hover transition-all position-relative overflow-hidden group border border-transparent hover-border-subtle"
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}>

                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center gap-x-2">
                            <div className="bg-white p-1.5 rounded-3 shadow-sm d-flex align-items-center justify-content-center">
                                <Megaphone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            </div>
                            <h6 className="mb-0 fw-bold tracking-tight" style={{ color: "var(--text-primary)" }}>{item.title}</h6>
                        </div>
                        <div className="d-flex align-items-center gap-x-1.5 text-muted" style={{ fontSize: '0.7rem' }}>
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            <span>{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                    </div>

                    <p className="mb-3 small text-secondary" style={{ lineHeight: '1.5' }}>{item.content || item.message}</p>

                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-x-2">
                            <span className="badge-modern d-flex align-items-center gap-x-1.5 px-2 py-1 rounded-pill bg-white border small text-muted" style={{ fontSize: '0.65rem' }}>
                                <Users className="w-2.5 h-2.5 flex-shrink-0" />
                                <span className="text-uppercase fw-bold letter-spacing-1">{item.targetRole || item.targetAudience || 'General'}</span>
                            </span>
                        </div>

                        {onDelete && (
                            <button
                                className="btn btn-sm btn-icon rounded-pill px-3 py-1.5 d-flex align-items-center gap-x-2 text-danger hover-bg-danger-subtle border-0"
                                onClick={() => onDelete(item)}
                            >
                                <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="small fw-bold">Remove</span>
                            </button>
                        )}
                    </div>

                    <ChevronRight className="w-4.5 h-4.5 position-absolute text-primary opacity-0 mt-3 group-hover-opacity-10 transition-all flex-shrink-0"
                        style={{ bottom: '15px', right: '15px', pointerEvents: 'none' }} />
                </div>
            ))}

        </div>
    );
}

export default AnnouncementList;
