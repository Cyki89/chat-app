import Form from "../forms/Form";
import useRegister from "../../hooks/users/useRegister";

const INPUTS = [
  {
    title: "Username",
    name: "username",
  },
  {
    title: "Password",
    name: "password",
    type: "password",
  },

  {
    title: "Confirm Password",
    name: "confirm_password",
    type: "password",
  },

  {
    title: "Profile Image",
    name: "image",
    type: "file",
  },
];

const Register = () => {
  return (
    <Form
      useFunc={useRegister}
      formData={{
        username: "",
        password: "",
        confirm_password: "",
        image: null,
      }}
      formTitle={"Register Form"}
      submitBtnTitle={"Register"}
      inputs={INPUTS}
    />
  );
};

export default Register;
