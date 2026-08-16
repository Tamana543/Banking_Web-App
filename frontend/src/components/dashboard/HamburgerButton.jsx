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
        type="button"
        aria-label={
          sidebarOpen
            ? "Close navigation menu"
            : "Open navigation menu"
        }
        aria-expanded={ariaExpanded ?? sidebarOpen}
        aria-controls={ariaControls ?? "dashboard-sidebar"}
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>
    );
  }
);
export default HamburgerButton;