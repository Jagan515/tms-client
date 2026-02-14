import { useEffect, useState } from "react";
import batchService from "../api/batchService";
import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";
import BatchList from "../components/batches/BatchList";
import CreateBatchModal from "../../../components/modals/CreateBatchModal";
import { Plus, Users, Search, Calendar } from "lucide-react";

function BatchManagement() {
    const [batches, setBatches] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);

    const fetchBatches = async (page = 1) => {
        try {
            setLoading(true);
            const data = await batchService.getAll({
                page,
                limit: 10,
                search: searchTerm
            });
            setBatches(data.batches || []);
            setPagination({
                page: data.page || page,
                limit: 10,
                pages: data.totalPages || 1,
                total: data.totalBatches || 0
            });
        } catch (error) {
            console.error("Failed to fetch batches", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches(1);
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            fetchBatches(1);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            fetchBatches(newPage);
        }
    };

    const handleEdit = (batch) => {
        setSelectedBatch(batch);
        setShowCreateModal(true);
    };

    const handleDelete = async (batchId) => {
        try {
            await batchService.delete(batchId);
            fetchBatches(pagination.page);
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const handleModalClose = () => {
        setShowCreateModal(false);
        setSelectedBatch(null);
    };

    if (loading && batches.length === 0) return <Loading text="Loading batches..." />;

    return (
        <div className="p-4 animate-fade-in">
            <PageHeader
                title="Batch Management"
                subtitle="Create and manage your teaching batches"
                icon={Calendar}
            />

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
                <div className="position-relative" style={{ maxWidth: '400px', flex: '1' }}>
                    <Search className="position-absolute top-50 translate-middle-y ms-3 text-primary opacity-50" size={18} />
                    <input
                        type="text"
                        className="form-control ps-5 rounded-pill bg-white border-0 shadow-sm"
                        placeholder="Search batches..."
                        style={{ height: '48px' }}
                        value={searchTerm}
                        onChange={handleSearch}
                        onKeyDown={handleSearchSubmit}
                    />
                </div>

                <button
                    className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-lg hover-lift"
                    onClick={() => setShowCreateModal(true)}
                    style={{ height: '48px' }}
                >
                    <Plus size={18} />
                    <span className="fw-bold">Create New Batch</span>
                </button>
            </div>

            <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                        <Users size={20} className="text-primary" />
                        <h6 className="mb-0 fw-bold">
                            Total Batches: <span className="text-primary">{pagination.total || batches.length}</span>
                        </h6>
                    </div>
                    {pagination.pages > 1 && (
                        <div className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
                            Page {pagination.page} of {pagination.pages}
                        </div>
                    )}
                </div>
            </div>

            <BatchList
                batches={batches}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {pagination.pages > 1 && (
                <div className="mt-5 d-flex justify-content-center gap-2">
                    <button
                        className="btn btn-outline-primary rounded-pill px-4"
                        disabled={pagination.page === 1}
                        onClick={() => handlePageChange(pagination.page - 1)}
                    >
                        Previous
                    </button>
                    <button
                        className="btn btn-primary rounded-pill px-4 shadow-sm"
                        disabled={pagination.page === pagination.pages}
                        onClick={() => handlePageChange(pagination.page + 1)}
                    >
                        Next Page
                    </button>
                </div>
            )}

            <CreateBatchModal
                show={showCreateModal}
                onClose={handleModalClose}
                onSuccess={() => fetchBatches(pagination.page)}
                initialData={selectedBatch}
            />
        </div>
    );
}

export default BatchManagement;
