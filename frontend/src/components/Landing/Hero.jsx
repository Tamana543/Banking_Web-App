import hero from "../../assets/images/hero.png";
import "../../styles/landing/hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="header__title" id="header-main">
        <h1>
          When
          <span className="highlight"> banking </span>
          meets
          <br />
          <span className="highlight"> minimalist </span>
        </h1>

        <div className="header-sec">
          <h4>
            A simpler banking experience for a simpler life.
          </h4>

          <button className="btn--text btn--scroll-to">
            Learn More ↓
          </button>
        </div>

        <img
          src={hero}
          className="header__img"
          alt="Minimalist bank items"
        />
      </div>
    </section>
  );
}

export default Hero;