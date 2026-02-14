function PageHeader({ title, subtitle = "", actionButton = null }) {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4">

            <div>
                <h3 className="fw-bold mb-1">{title}</h3>
                {subtitle && (
                    <p className="text-muted mb-0 small">
                        {subtitle}
                    </p>
                )}
            </div>

            {actionButton && (
                <div>
                    {actionButton}
                </div>
            )}

        </div>
    );
}

export default PageHeader;
