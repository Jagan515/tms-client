function FormInput({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder = "",
    required = false,
    error = "",
    icon: Icon
}) {
    return (
        <div className="mb-4 animate-fade-in">
            {label && (
                <label htmlFor={name} className="form-label small fw-bold text-muted text-uppercase mb-2 px-1 letter-spacing-1">
                    {label} {required && <span className="text-danger">*</span>}
                </label>
            )}
            <div className="position-relative d-flex align-items-center">
                {Icon && (
                    <div className="position-absolute start-0 ps-3 d-flex align-items-center text-muted opacity-75" style={{ pointerEvents: 'none', height: '100%' }}>
                        <Icon className="w-5 h-5 flex-shrink-0" />
                    </div>
                )}
                <input
                    type={type}
                    className={`form-control ${Icon ? 'ps-5' : 'ps-3'} rounded-3 transition-standard ${error ? "is-invalid" : ""}`}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    style={{
                        height: '48px', // Enforce consistent height
                        backgroundColor: 'var(--surface-card)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        lineHeight: '1.5'
                    }}
                />
                {error && <div className="invalid-feedback px-1 mt-1 small d-flex align-items-center gap-1">{error}</div>}
            </div>

        </div>
    );
}

export default FormInput;
