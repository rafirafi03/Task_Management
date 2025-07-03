import { FiLogOut } from "react-icons/fi";
import {
  dismissToast,
  errorToast,
  loadingToast,
  successToast,
} from "../../../utils/toast";
import { toast } from "react-toastify";
import { useAdminLogoutMutation } from "../../../store/slices/apiSlice";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export default function Header() {
  const navigate = useNavigate();

  const [logout] = useAdminLogoutMutation();

  const handleLogout = useCallback(async () => {
    try {
      const toastLoading = loadingToast("logging out...");
      const response = await logout({});
      dismissToast(toastLoading);

      const { success } = response.data;

      if (success) {
        successToast("logged out");
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else {
        errorToast("something went wrong");
      }
    } catch (error) {
      toast.dismiss();
      errorToast("An error occurred while logging out.");
      console.error("Logout error:", error);
    }
  }, [logout, navigate]);

  return (
    <header className="fixed top-0 left-0 w-full z-10 flex items-center justify-between px-10 py-4 bg-gray-900 text-white shadow">
      {" "}
      <h1 className="text-lg font-semibold">Task Management</h1>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 hover:text-red-400 hover:cursor-pointer"
      >
        <FiLogOut size={20} />
      </button>
    </header>
  );
}
