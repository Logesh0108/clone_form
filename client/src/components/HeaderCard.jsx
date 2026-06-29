import { useState } from "react";
import { MdOutlineCloudUpload } from "react-icons/md";
import AutoSaveModal from "./AutoSaveModal";
import { submitForm } from "../services/formService";

function HeaderCard() {

  const [open,setOpen]=useState(false);

  return (

    <>
      <div className="header-card">

        <div className="purple-line"></div>

        <h1>Interns Details : IBM</h1>

        <p className="subtitle">
          Please fill the details with caps, clear picture upload
        </p>

        <hr/>

        <div className="email-row">

          <div className="email-content">

            <strong className="email">
              logeshnalliyappan@gmail.com
            </strong>

            <a href="#" className="switch-account">
              Switch account
            </a>

          </div>

          <MdOutlineCloudUpload
              className="cloud-icon"
              onClick={()=>setOpen(true)}
          />

        </div>

        <p className="notice">
          The name, email address and photo associated with your Google
          Account will be recorded when you upload files and submit this form.
        </p>

        <p className="required-note">
          * Indicates required question
        </p>

      </div>

      <AutoSaveModal
        open={open}
        onClose={()=>setOpen(false)}
      />

    </>
  );
}

export default HeaderCard;