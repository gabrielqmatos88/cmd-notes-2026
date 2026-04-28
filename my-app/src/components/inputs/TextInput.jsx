// TextInput Component
// Input field for text type variables

import './InputStyles.scss';

function TextInput({
  name,
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  error = null,
}) {
  return (
    <div className="input-group">
      {label && (
        <label className="input-group__label" htmlFor={name}>
          {label}
          {required && <span className="input-group__required">*</span>}
        </label>
      )}
      <input
        type="text"
        id={name}
        name={name}
        className={`input-group__input ${error ? 'input-group__input--error' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
}

export default TextInput;
