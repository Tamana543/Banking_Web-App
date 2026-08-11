import "../../styles/dashboard/hamburger.css";

function HamburgerButton({
    sidebarOpen,
    onClick,
    "aria-expanded": ariaExpanded,
    "aria-controls": ariaControls,
}) {
    return (
        <button
            className={`hamburger-btn ${
                sidebarOpen ? "active" : ""
            }`}
            onClick={onClick}
            aria-label={
                sidebarOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            }
            aria-expanded={ariaExpanded}
            aria-controls={ariaControls}
            type="button"
        >
            <span></span>
            <span></span>
            <span></span>
        </button>
    );
}

export default HamburgerButton;