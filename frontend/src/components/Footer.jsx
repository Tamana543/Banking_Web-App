import { Links } from "react-router-dom";

function Footer(){
 <footer class="footer">
      <ul class="footer__nav">
        <li class="footer__item">
          <link class="footer__link" to="#">About</link>
        </li>
        <li class="footer__item">
          <link class="footer__link" to="#">Pricing</link>
        </li>
        <li class="footer__item">
          <link class="footer__link" to="#">Terms of Use</link>
        </li>
        <li class="footer__item">
          <link class="footer__link" to="#">Privacy Policy</link>
        </li>
        <li class="footer__item">
          <link class="footer__link" to="#">Careers</link>
        </li>
        <li class="footer__item">
          <link class="footer__link" to="#">Blog</link>
        </li>
        <li class="footer__item">
          <link class="footer__link" to="#">Contact Us</link>
        </li>
      </ul>
      <img src="img/icon.png" alt="Logo" class="footer__logo" />
      <p class="footer__copyright">
        Cooded by
        <link
          class="footer__link twitter-link"
          target="_blank"
          to=" https://github.com/Tamana543"
          title="contact me 👩‍💻 "
          >Tamana Farzami</link>
        . Use for Practicing. .
      </p>
    </footer>
}
export default Footer;