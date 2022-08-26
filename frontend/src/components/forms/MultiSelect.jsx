import { forwardRef } from "react";
import Form from "react-bootstrap/Form";

const MultiSelect = (
  {
    title,
    name,
    value,
    setValue,
    options,
    optionName,
    style = {},
    error,
    ...rest
  },
  ref
) => {
  return (
    <Form.Group className={!error ? "mb-3" : ""} style={style}>
      <Form.Label>{title}</Form.Label>
      <Form.Control
        as={"select"}
        multiple
        name={name}
        ref={ref}
        value={value}
        onChange={(e) =>
          setValue(
            [].slice.call(e.target.selectedOptions).map((item) => item.value)
          )
        }
        className="form-control form-input"
        isInvalid={error}
        {...rest}>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option[optionName]}
          </option>
        ))}
      </Form.Control>
      <Form.Control.Feedback type="invalid" className="text-center">
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default forwardRef(MultiSelect);
