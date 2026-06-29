import {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

import {
  MdUploadFile,
  MdClose,
  MdErrorOutline,
} from "react-icons/md";

import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileArchive,
  FaFileAlt,
} from "react-icons/fa";

const FileUpload = forwardRef(
  ({ label, name, onFileChange }, ref) => {
    const inputRef = useRef(null);

    const [file, setFile] = useState(null);
    const [error, setError] = useState(false);

    const handleClick = () => {
      inputRef.current.click();
    };

    const handleChange = (e) => {
      const selectedFile = e.target.files[0];

      if (selectedFile) {
        setFile(selectedFile);
        setError(false);

        if (onFileChange) {
          onFileChange(name, selectedFile);
        }
      }
    };

    const clearFile = () => {
      inputRef.current.value = "";
      setFile(null);

      if (onFileChange) {
        onFileChange(name, null);
      }
    };

    const validate = () => {
      if (!file) {
        setError(true);
        return false;
      }

      setError(false);
      return true;
    };

useImperativeHandle(ref, () => ({
  validate,
  getFile: () => file,

  reset: () => {
    setFile(null);
    setError(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  },
}));
    const getFileIcon = () => {
      if (!file) return null;

      const ext = file.name.split(".").pop().toLowerCase();

      switch (ext) {
        case "pdf":
          return <FaFilePdf className="pdf-icon" />;

        case "doc":
        case "docx":
          return <FaFileWord className="word-icon" />;

        case "xls":
        case "xlsx":
          return <FaFileExcel className="excel-icon" />;

        case "png":
        case "jpg":
        case "jpeg":
        case "gif":
        case "webp":
          return <FaFileImage className="image-icon" />;

        case "zip":
        case "rar":
          return <FaFileArchive className="zip-icon" />;

        default:
          return <FaFileAlt className="default-icon" />;
      }
    };

    return (
      <div className={`question-card ${error ? "error" : ""}`}>
        <label className="question-title">
          {label}
          <sup className="required">*</sup>
        </label>

        <p className="upload-info">
          Upload 1 supported file: PDF, DOC, DOCX or Image. Max 100 MB.
        </p>

        <input
          ref={inputRef}
          type="file"
          className="hidden-input"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleChange}
        />

        {!file ? (
          <button
            type="button"
            className="upload-btn"
            onClick={handleClick}
          >
            <MdUploadFile />
            Add File
          </button>
        ) : (
          <div className="uploaded-file">
            <div className="file-chip">
              {getFileIcon()}

              <div className="file-text">
                {file.name}
              </div>
            </div>

            <button
              type="button"
              className="remove-file"
              onClick={clearFile}
            >
              <MdClose />
            </button>
          </div>
        )}

        {error && (
          <div className="upload-error">
            <MdErrorOutline />
            <p>This is a required question</p>
          </div>
        )}
      </div>
    );
  }
);

export default FileUpload;