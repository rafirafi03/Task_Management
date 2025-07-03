import { useCallback } from "react";
import useTaskForm from "../../../hooks/useTaskForm";

type pageProps = {
  addTask: (title: string) => void;
};

export default function InputWithButton({ addTask }: pageProps) {
  const { values, errors, handleChange, validate, resetForm } = useTaskForm();

  const handleSubmit = useCallback(() => {
  if (!validate()) return;
  addTask(values.title.trim());
  resetForm();
}, [addTask, resetForm, validate, values.title]);

  return (
    <div className="flex items-center border border-gray-800 rounded-md text-white overflow-hidden max-w-5xl mt-25 mx-auto">
      <input
        name="title"
        type="text"
        placeholder="Enter task..."
        value={values.title}
        onChange={handleChange}
        className="flex-1 px-4 py-2"
      />
      {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title}</p>
            )}
      <button onClick={handleSubmit} className="bg-gray-900 text-white px-4 py-2 hover:bg-gray-700 hover:cursor-pointer transition-colors">
        Add
      </button>
    </div>
  );
}
