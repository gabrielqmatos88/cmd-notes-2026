// DropdownSelect Component
// Dropdown/Select for dropdown type variables

import './InputStyles.scss';

function DropdownSelect({
  name,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option...',
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
      <select
        id={name}
        name={name}
        className={`input-group__select ${error ? 'input-group__input--error' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
}

export default DropdownSelect;
