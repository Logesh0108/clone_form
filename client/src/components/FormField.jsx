function FormField({
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
}) {
  const id = `input-${name}`;
  return (
    <div className="question-card">
      <label htmlFor={id} className="question-title">
        {label}
        {required && <span className="required">*</span>}
      </label>

      <input
        id={id}
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