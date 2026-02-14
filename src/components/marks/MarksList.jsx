function MarksList({ marks = [] }) {
    if (!marks || marks.length === 0) {
        return <p className="text-center text-muted my-3">No marks recorded yet.</p>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>Date</th>
                        <th>Exam</th>
                        <th>Subject</th>
                        <th>Score</th>
                        <th>%</th>
                    </tr>
                </thead>
                <tbody>
                    {marks.map((mark, index) => {
                        const percentage = Math.round((mark.marksObtained / mark.totalMarks) * 100);
                        return (
                            <tr key={index}>
                                <td className="small">{new Date(mark.createdAt).toLocaleDateString()}</td>
                                <td className="fw-bold">{mark.examName}</td>
                                <td>{mark.subject}</td>
                                <td>{mark.marksObtained}/{mark.totalMarks}</td>
                                <td>
                                    <span className={`badge ${percentage >= 40 ? 'bg-success' : 'bg-danger'}`}>
                                        {percentage}%
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default MarksList;
