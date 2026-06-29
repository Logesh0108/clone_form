function FormField({
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
}) {
  return (
    <div className="question-card">
      <label className="question-title">
        {label}
        {required && <span className="required">*</span>}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="text-input"
        placeholder="Your answer"
        required={required}
      />
    </div>
  );
}

export default FormField;