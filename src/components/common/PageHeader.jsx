function PageHeader({ title, subtitle = "", actionButton = null }) {
    return (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">

            <div className="animate-fade-in">
                <h2 className="fw-extrabold mb-1 tracking-tight text-dark h3">{title}</h2>
                {subtitle && (
                    <p className="text-muted mb-0 small fw-medium opacity-75">
                        {subtitle}
                    </p>
                )}
            </div>

            {actionButton && (
                <div className="w-100 w-md-auto animate-fade-in">
                    {actionButton}
                </div>
            )}

        </div>
    );
}

export default PageHeader;
