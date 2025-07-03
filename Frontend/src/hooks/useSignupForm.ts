import { useState } from "react";

type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignupFormErrors = {
  name?: string
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const useSignupForm = () => {
  const [values, setValues] = useState<SignupFormValues>({
    name:"",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<SignupFormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: SignupFormErrors = {};

    if (!values.name) {
      newErrors.name = "Name is required";
    } else if (values.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!values.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!values.password) {
      newErrors.password = "Password is required";
    } else if (values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (values.confirmPassword !== values.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setValues({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    validate,
    resetForm,
  };
};

export default useSignupForm;
