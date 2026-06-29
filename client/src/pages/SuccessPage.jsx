import "./SuccessPage.css";
import { useNavigate } from "react-router-dom";

function SuccessPage() {
  const navigate = useNavigate();

  const handleAnotherResponse = () => {
    localStorage.removeItem("formSubmitted");
    navigate("/");
  };

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="top-line"></div>

        <div className="success-content">
          <h1>Interns Details : NavaDhiti</h1>

          <p className="recorded-text">
            Your response has been recorded.
          </p>

          <button
            className="another-response"
            onClick={handleAnotherResponse}
          >
            Submit another response
          </button>
        </div>
      </div>

      <div className="success-footer">

        <p className="password-warning">
          Never submit passwords through Google Forms.
        </p>

        <p className="footer-links">
          This content is neither created nor endorsed by Google. -
          <a href="https://support.google.com/a/answer/9310331"> Contact form owner</a> -
          <a href="https://policies.google.com/terms"> Terms of Service</a> -
          <a href="https://policies.google.com/privacy"> Privacy Policy</a>
        </p>

        <p className="footer-links">
          Does this form look suspicious?
          <a href="#"> Report</a>
        </p>
<a
  href="https://workspace.google.com/products/forms/?utm_source=product&utm_medium=forms_logo&utm_campaign=forms"
  target="_blank"
  rel="noopener noreferrer"
  className="google-forms-link"
>
  <div className="google-forms-logo">
    <span className="google-bold">Google</span>
    <span className="forms-light"> Forms</span>
  </div>
</a>

      </div>
    </div>
  );
}

export default SuccessPage;