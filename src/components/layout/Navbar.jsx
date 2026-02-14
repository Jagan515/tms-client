import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import PageHeader from "../components/common/PageHeader";
import StatusBadge from "../components/common/StatusBadge";
import Loading from "../components/Loading";

import { SET_FEES } from "../redux/fees/action";
import { serverEndpoint } from "../config/appConfig";

function Fees() {

    const dispatch = useDispatch();
    const fees = useSelector((state) => state.fees);

    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchFees = async () => {

        try {
            const response = await axios.get(
                `${serverEndpoint}/fees?month=${month}&year=${year}&page=${page}&limit=5`,
                { withCredentials: true }
            );

            dispatch({
                type: SET_FEES,
                payload: response.data.fees
            });

            setTotalPages(response.data.totalPages);

        } catch (error) {
            console.error("Fetch fees failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFees();
    }, [month, year, page]);

    const handleMarkPaid = async (feeId) => {

        try {

            await axios.patch(
                `${serverEndpoint}/fees/mark-paid/${feeId}`,
                {},
                { withCredentials: true }
            );

            fetchFees();

        } catch (error) {
            console.error("Mark paid failed", error);
        }
    };

    if (loading) {
        return <Loading text="Loading fees..." />;
    }

    return (
        <div>

            <PageHeader
                title="Fees"
                subtitle="Manage monthly student fees"
            />

            {/* Filters */}
            <div className="row mb-3">

                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                    >
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                Month {i + 1}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-3">
                    <input
                        type="number"
                        className="form-control"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                </div>

            </div>

            <div className="card shadow-sm">
                <div className="card-body p-0">

                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Student</th>
                                <th>Month</th>
                                <th>Year</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {fees.map(fee => (
                                <tr key={fee._id}>
                                    <td>{fee.studentName}</td>
                                    <td>{fee.month}</td>
                                    <td>{fee.year}</td>
                                    <td>₹{fee.amount}</td>
                                    <td>
                                        <StatusBadge status={fee.status} />
                                    </td>
                                    <td>
                                        {fee.status === "pending" && (
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => handleMarkPaid(fee._id)}
                                            >
                                                Mark Paid
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-3">
                <button
                    className="btn btn-sm btn-secondary me-2"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Prev
                </button>

                <span className="align-self-center">
                    Page {page} of {totalPages}
                </span>

                <button
                    className="btn btn-sm btn-secondary ms-2"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>

        </div>
    );
}

export default Fees;
