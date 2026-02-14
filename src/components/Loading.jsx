function Loading({ text = "Loading..." }) {

    return (
        <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary me-3"></div>
            <span>{text}</span>
        </div>
    );
}

export default Loading;
