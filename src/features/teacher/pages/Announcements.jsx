import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import AppModal from "../../../components/common/AppModal";
import Loading from "../../../components/common/Loading";
import AnnouncementList from "../../../components/announcements/AnnouncementList";
import CreateAnnouncement from "../../../components/announcements/CreateAnnouncement";
import announcementService from "../api/announcementService";
import { Plus, Megaphone, Search, Filter } from "lucide-react";

function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });

    const fetchAnnouncements = async (page = 1) => {
        setLoading(true);
        try {
            const data = await announcementService.getAll(page, pagination.limit);
            setAnnouncements(data.announcements || []);
            setPagination(data.pagination || { page: 1, pages: 1, total: 0, limit: 10 });

            if (!data.announcements || data.announcements.length === 0) {
                // Keep the placeholder if no real data
            }
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAnnouncements(1); }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            fetchAnnouncements(newPage);
        }
    };

    const handleCreate = async (formData) => {
        setActionLoading(true);
        try {
            await announcementService.create(formData);
            setShowCreateModal(false);
            fetchAnnouncements();
        } catch (error) { console.error("Create failed", error); }
        finally { setActionLoading(false); }
    };

    const handleDelete = async (item) => {
        if (window.confirm("Permanently remove this announcement from the bulletin?")) {
            try {
                await announcementService.delete(item._id);
                fetchAnnouncements();
            } catch (error) { console.error("Delete failed", error); }
        }
    };

    if (loading) return <Loading text="Synchronizing bulletin board..." />;

    return (
        <div className="p-4 animate-fade-in" style={{ minHeight: '100vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <PageHeader
                    title="Communication Hub"
                    subtitle="Broadcast critical updates and notices to the institutional community"
                />
                <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2 shadow-lg hover-lift" onClick={() => setShowCreateModal(true)}>
                    <Plus size={18} />
                    <span>Broadcast Message</span>
                </button>
            </div>

            <div className="card-modern shadow-sm border-0 overflow-hidden">
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-tertiary" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <div className="d-flex align-items-center gap-2">
                        <Megaphone size={18} className="text-primary" />
                        <h5 className="mb-0 fw-bold">Live Bulletin ({announcements.length})</h5>
                    </div>
                </div>
                <div className="card-body p-4">
                    <AnnouncementList announcements={announcements} onDelete={handleDelete} />
                </div>
                {pagination.pages > 1 && (
                    <div className="p-4 border-top bg-tertiary d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <div className="small text-muted fw-bold">
                            Showing page <span className="text-primary">{pagination.page}</span> of <span className="text-primary">{pagination.pages}</span>
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-sm btn-outline-primary rounded-pill px-4 fw-bold"
                                disabled={pagination.page === 1}
                                onClick={() => handlePageChange(pagination.page - 1)}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-sm btn-primary rounded-pill px-4 fw-bold shadow-sm"
                                disabled={pagination.page === pagination.pages}
                                onClick={() => handlePageChange(pagination.page + 1)}
                            >
                                Next page
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <AppModal show={showCreateModal} title="Compose Broadcast" onClose={() => setShowCreateModal(false)}>
                <CreateAnnouncement onSubmit={handleCreate} onCancel={() => setShowCreateModal(false)} loading={actionLoading} />
            </AppModal>

        </div>
    );
}

export default Announcements;
