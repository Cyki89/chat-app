import { forwardRef } from "react";
import Form from "react-bootstrap/Form";

const Input = (
  {
    title,
    name,
    value,
    setValue,
    placeholder,
    type = "text",
    style = {},
    error,
    ...rest
  },
  ref
) => {
  const valueProps =
    type === "file" ? { defaultValue: value } : { value: value };

  return (
    <Form.Group className={!error ? "mb-3" : ""} style={style}>
      <Form.Label>{title}</Form.Label>
      <Form.Control
        name={name}
        ref={ref}
        onChange={setValue}
        {...valueProps}
        className="form-input"
        placeholder={placeholder}
        type={type}
        isInvalid={error}
        {...rest}
      />
      <Form.Control.Feedback type="invalid" className="text-center">
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default forwardRef(Input);
