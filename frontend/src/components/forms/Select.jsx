import { forwardRef } from "react";
import Form from "react-bootstrap/Form";

const Select = (
  {
    title,
    name,
    value,
    setValue,
    options,
    optionName,
    placeholder = "-------",
    style = {},
    error,
    ...rest
  },
  ref
) => {
  return (
    <Form.Group className={!error ? "mb-3" : ""} style={style}>
      <Form.Label>{title}</Form.Label>
      <Form.Select
        name={name}
        ref={ref}
        value={value}
        onChange={setValue}
        className="form-control form-input"
        isInvalid={error}
        {...rest}>
        <option>{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option[optionName]}
          </option>
        ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid" className="text-center">
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default forwardRef(Select);
