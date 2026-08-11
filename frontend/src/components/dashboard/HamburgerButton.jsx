import { forwardRef } from "react";
import "../../styles/dashboard/hamburger.css";

const HamburgerButton = forwardRef(
    function HamburgerButton(
        {
            sidebarOpen,
            onClick,
            "aria-expanded": ariaExpanded,
            "aria-controls": ariaControls,
        },
        ref
    ) {
        return (
            <button
                ref={ref}
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
);

export default HamburgerButton;