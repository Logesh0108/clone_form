import "../AutoSaveModal.css";
import draftImage from "/draft_responses_onboarding.png";
import { submitForm } from "../services/formService";

function AutoSaveModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">

      <div className="modal">

<img
  src="/draft_responses_onboarding.png"
  alt="Auto Save"
  className="modal-image"
/>

        <h2>Auto-save your work</h2>

        <p>
          Google Forms automatically saves your progress for 30 days
          when you're signed in to your Google Account so that you can
          work across devices or take a break without losing a step.
        </p>

        <button
          className="ok-btn"
          onClick={onClose}
        >
          OK
        </button>

      </div>

    </div>
  );
}

export default AutoSaveModal;