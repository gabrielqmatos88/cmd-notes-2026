// NumberInput Component
// Input field for number type variables

import './InputStyles.scss';

function NumberInput({
  name,
  label,
  value,
  onChange,
  placeholder = '',
  min = undefined,
  max = undefined,
  step = 1,
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
        type="number"
        id={name}
        name={name}
        className={`input-group__input ${error ? 'input-group__input--error' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
}

export default NumberInput;
