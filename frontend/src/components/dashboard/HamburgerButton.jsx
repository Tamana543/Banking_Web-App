import "../../styles/dashboard/hamburger.css";

function HamburgerButton({
    sidebarOpen,
    onClick,
}) {
    return (
        <button
            className={`hamburger-btn ${
                sidebarOpen ? "active" : ""
            }`}
            onClick={onClick}
            aria-label="Toggle Menu"
        >
            <span></span>
            <span></span>
            <span></span>
        </button>
    );
}

export default HamburgerButton;