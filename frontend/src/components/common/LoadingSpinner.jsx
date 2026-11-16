import "../../styles/components/loadingSpinner.css";

function LoadingSpinner({ size = "medium" }) {
    return (
        <div className={`spinner ${size}`}></div>
    );
}

export default LoadingSpinner;