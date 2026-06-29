import "../Footer.css";
import { submitForm } from "../services/formService";

function Footer() {
  return (
    <div className="footer-wrapper">

      <p className="password-text">
        Never submit passwords through Google Forms.
      </p>

      <div className="footer-info">

        <p>
          This form was created inside <strong>navadhiti.com</strong>. -
          <a href="#"> Contact form owner</a>
        </p>

        <p>
          Does this form look suspicious?
          <a href=""> Report</a>
        </p>

      </div>

<div className="google-brand">

    <img
        src="/googlelogo_dark_clr_74x24px.svg"
        alt="Google"
        className="google-logo"
    />

    <span className="forms-text">
        Forms
    </span>

</div>

    </div>
  );
}

export default Footer;