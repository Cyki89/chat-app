import Form from "react-bootstrap/Form";

const Input = ({
  title,
  name,
  value,
  setValue,
  placeholder,
  type = "text",
  style = {},
  error,
  ...rest
}) => {
  return (
    <Form.Group className={!error ? "mb-3" : ""} style={style}>
      <Form.Label>{title}</Form.Label>
      <Form.Control
        name={name}
        onChange={setValue}
        defaultValue={value}
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

export default Input;
