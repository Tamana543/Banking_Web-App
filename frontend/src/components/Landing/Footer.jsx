import { Links } from "react-router-dom";

function Footer(){
 <footer className="footer">
      <ul className="footer__nav">
        <li className="footer__item">
          <link className="footer__link" to="#">About</link>
        </li>
        <li className="footer__item">
          <link className="footer__link" to="#">Pricing</link>
        </li>
        <li className="footer__item">
          <link className="footer__link" to="#">Terms of Use</link>
        </li>
        <li className="footer__item">
          <link className="footer__link" to="#">Privacy Policy</link>
        </li>
        <li className="footer__item">
          <link className="footer__link" to="#">Careers</link>
        </li>
        <li className="footer__item">
          <link className="footer__link" to="#">Blog</link>
        </li>
        <li className="footer__item">
          <link className="footer__link" to="#">Contact Us</link>
        </li>
      </ul>
      <img src="img/icon.png" alt="Logo" className="footer__logo" />
      <p className="footer__copyright">
        Cooded by
        <link
          className="footer__link twitter-link"
          target="_blank"
          to=" https://github.com/Tamana543"
          title="contact me 👩‍💻 "
          >Tamana Farzami</link>
        . Use for Practicing. .
      </p>
    </footer>
}
export default Footer;