import { useSignupMutation } from "../../store/slices/apiSlice";
import useSignupForm from "../../hooks/useSignupForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  dismissToast,
  errorToast,
  loadingToast,
  successToast,
} from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export default function Signup() {
  const navigate = useNavigate();
  const [signupMutation] = useSignupMutation();
  const { values, errors, handleChange, validate, resetForm } = useSignupForm();

  const signupHandler = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validate()) return;

      try {
        const toastLoading = loadingToast("submitting");
        const res = await signupMutation({
          name: values.name,
          email: values.email,
          password: values.password,
        }).unwrap();

        dismissToast(toastLoading);

        if (res.success && res.token) {
          localStorage.setItem("token", res.token);
          successToast("Sign in successful");
          resetForm();
          setTimeout(() => {
            navigate("/");
          }, 100);
        } else {
          errorToast(res?.error || "Login failed");
        }
      } catch (err) {
        toast.dismiss();

        const errorMessage =
          (err as { data?: { error?: string }; status?: number })?.data
            ?.error || "Signup failed";

        errorToast(errorMessage);
      }
    },
    [
      signupMutation,
      values.name,
      values.email,
      values.password,
      validate,
      resetForm,
      navigate,
    ]
  );

  const handleLoginNavigation = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      {" "}
      <div className="w-full max-w-md p-4 bg-gray-900 border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-900 dark:border-blue-950">
        <form className="space-y-6" onSubmit={signupHandler}>
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">
            Creat a Account
          </h5>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={values.name}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="name"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={values.email}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="name@company.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={values.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirm password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full text-white bg-black hover:bg-gray-700 cursor-pointer focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black dark:hover:bg-gray-800 dark:focus:ring-black"
          >
            Sign Up
          </button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            already a user?{" "}
            <a
              onClick={handleLoginNavigation}
              className="text-black hover:underline dark:text-blue-500 cursor-pointer"
            >
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
