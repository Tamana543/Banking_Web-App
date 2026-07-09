import "../../styles/dashboard/responsive.css"
function HamburgerButton({
    onClick,
}) {

    return (

        <button
            className="hamburger-btn"
            onClick={onClick}
        >

            ☰

        </button>

    );

}

export default HamburgerButton;