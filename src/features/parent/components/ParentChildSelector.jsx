import { ChevronRight } from "lucide-react";

function ParentChildSelector({ children, selectedChildId, onSelect }) {
    if (!children) return null;

    return (
        <div className="d-flex align-items-center gap-x-3">
            <div className="d-none d-sm-block small text-muted text-uppercase fw-bold letter-spacing-1 opacity-75">Switch Ward:</div>
            <select
                className="form-select border-0 bg-transparent fw-bold p-0 pe-4"
                value={selectedChildId}
                onChange={(e) => onSelect(e.target.value)}
                style={{
                    cursor: 'pointer',
                    fontSize: '1rem',
                    color: 'var(--brand-primary)',
                    minWidth: '200px',
                    boxShadow: 'none',
                    backgroundImage: 'none',
                    letterSpacing: '-0.01em'
                }}
            >
                {children.map(child => (
                    <option key={child._id} value={child._id}>
                        {child.name} • Class {child.class}
                    </option>
                ))}
            </select>
            <ChevronRight className="w-4 h-4 text-muted opacity-50 flex-shrink-0" />
        </div>
    );
}

export default ParentChildSelector;
