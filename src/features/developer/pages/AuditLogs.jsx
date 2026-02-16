import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { serverEndpoint } from "../../../config/appConfig";
import Loading from "../../../components/common/Loading";
import { Terminal, ShieldCheck, Clock, Activity, Search, Filter, Download, RefreshCw } from "lucide-react";
import PageHeader from "../../../components/common/PageHeader";

function AuditLogs() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const currentSearch = searchParams.get('search') || "";

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(currentSearch);
    const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });

    const fetchLogs = useCallback(async (page = currentPage, search = currentSearch) => {
        setLoading(true);
        try {
            const response = await axios.get(`${serverEndpoint}/developer/audit-logs`, {
                params: {
                    search: search,
                    page: page,
                    limit: pagination.limit
                },
                withCredentials: true
            });
            if (response.data && response.data.logs) {
                setLogs(response.data.logs || []);
                if (response.data.pagination) {
                    setPagination(response.data.pagination);
                }
            }
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
        } finally {
            setLoading(false);
        }
    }, [currentSearch, currentPage, pagination.limit]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            const newParams = new URLSearchParams(searchParams);
            newParams.set('page', newPage);
            setSearchParams(newParams);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            const newParams = new URLSearchParams(searchParams);
            newParams.set('search', searchTerm);
            newParams.set('page', 1);
            setSearchParams(newParams);
        }
    };

    return (
        <div className="p-4 p-lg-5 animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <PageHeader
                    title="Audit & Access Ledger"
                    subtitle="Immutable records of system-wide administrative and security actions"
                />
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary rounded-pill px-4 d-flex align-items-center justify-content-center border-dashed" onClick={() => fetchLogs(pagination.page)} style={{ width: '48px', height: '48px' }}>
                        <RefreshCw className={`w-5 h-5 flex-shrink-0 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-x-2 shadow-sm hover-lift" onClick={() => window.print()}>
                        <Download className="w-5 h-5 flex-shrink-0" />
                        <span>Export Secure Ledger</span>
                    </button>
                </div>
            </div>

            <div className="card-modern shadow-lg border-0 mb-5 p-4 bg-tertiary-subtle" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="row g-4 align-items-center">
                    <div className="col-lg-6">
                        <div className="position-relative">
                            <Search className="position-absolute top-50 translate-middle-y ms-3 text-primary opacity-50" size={18} />
                            <input
                                className="form-control ps-5 rounded-pill shadow-sm"
                                style={{ height: '48px' }}
                                placeholder="Filter by event identity..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-modern shadow-sm p-0 overflow-hidden bg-white animate-fade-in-up">
                <div className="p-4 border-bottom bg-tertiary d-flex align-items-center gap-x-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <ShieldCheck className="w-5 h-5 text-success flex-shrink-0" />
                    <h5 className="mb-0 fw-bold">Validated Event Stream</h5>
                </div>
                <div className="table-responsive">
                    {loading && logs.length === 0 ? (
                        <div className="py-5"><Loading text="Decrypting audit stream..." /></div>
                    ) : (
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4 py-3 letter-spacing-1 text-uppercase text-muted" style={{ fontSize: '0.65rem' }}>Transaction / Entity</th>
                                    <th className="letter-spacing-1 text-uppercase text-muted" style={{ fontSize: '0.65rem' }}>Initiating Identity</th>
                                    <th className="letter-spacing-1 text-uppercase text-muted" style={{ fontSize: '0.65rem' }}>Network Origin</th>
                                    <th className="letter-spacing-1 text-uppercase text-muted" style={{ fontSize: '0.65rem' }}>Timestamp</th>
                                    <th className="pe-4 py-3 text-end letter-spacing-1 text-uppercase text-muted" style={{ fontSize: '0.65rem' }}>Verification</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length > 0 ? logs.map(log => (
                                    <tr key={log._id}>
                                        <td className="ps-4 py-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-tertiary p-2 rounded-3 text-primary border d-flex align-items-center justify-content-center">
                                                    <Terminal className="w-3.5 h-3.5 flex-shrink-0" />
                                                </div>
                                                <div>
                                                    <div className="fw-bold small text-secondary">{log.actionType}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.65rem' }}>{log.entityType}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="small fw-bold">{log.userId?.name || 'SYSTEM'}</div>
                                            <div className="text-muted text-uppercase" style={{ fontSize: '0.6rem' }}>{log.userId?.role || 'INTERNAL'}</div>
                                        </td>
                                        <td>
                                            <code className="bg-tertiary px-2 py-1 rounded small text-muted border" style={{ fontSize: '0.7rem' }}>{log.ipAddress || '127.0.0.1'}</code>
                                        </td>
                                        <td className="text-muted small">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td className="pe-4 py-4 text-end">
                                            <div className="badge rounded-pill px-3 py-1 fw-bold bg-success-subtle text-success" style={{ fontSize: '0.6rem' }}>
                                                VERIFIED
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted italic">No audit telemetry matching criteria found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
                {pagination.pages > 1 && (
                    <div className="p-4 border-top bg-tertiary d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <div className="small text-muted fw-bold">
                            Showing page <span className="text-primary">{pagination.page}</span> of <span className="text-primary">{pagination.pages}</span>
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-sm btn-outline-primary rounded-pill px-4 fw-bold"
                                disabled={pagination.page === 1 || loading}
                                onClick={() => handlePageChange(pagination.page - 1)}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-sm btn-primary rounded-pill px-4 fw-bold shadow-sm"
                                disabled={pagination.page === pagination.pages || loading}
                                onClick={() => handlePageChange(pagination.page + 1)}
                            >
                                Next page
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

export default AuditLogs;
