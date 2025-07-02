import { useState } from "react";

type TaskForm = {
  title: string;
};

type TaskFormErrors = {
  title?: string;
};

const useTaskForm = () => {
  const [values, setValues] = useState<TaskForm>({
    title: "",
  });

  const [errors, setErrors] = useState<TaskFormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: TaskFormErrors = {};

    if (!values.title) {
      newErrors.title = "title is required";
    } else if (values.title.length < 3) {
      newErrors.title = "Minimum 3 characters required!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setValues({
      title: "",
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

export default useTaskForm;
