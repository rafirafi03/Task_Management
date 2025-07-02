import Header from "../../components/User/Header/Header";
import InputWithButton from "../../components/User/Input/Input";
import Statustab from "../../components/User/StatusTab/Statustab";
import TaskList from "../../components/User/TaskList/Tasklist";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useFetchTasksQuery,
} from "../../store/slices/apiSlice";
import {
  loadingToast,
  successToast,
  dismissToast,
  errorToast,
} from "../../utils/toast";
import { toast } from "react-toastify";
import { getUserIdFromToken } from "../../utils/tokenHelper";
import { useEffect } from "react";
import fetchErrorCheck from "../../utils/fetchErrorCheck";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const userId = getUserIdFromToken("token");
  const { data, error: fetchTaskError, refetch } = useFetchTasksQuery(userId);
  const [createTaskMutation] = useCreateTaskMutation();
  const [deleteTaskMutation] = useDeleteTaskMutation();

  useEffect(() => {
    const isError = fetchErrorCheck({
      fetchError: fetchTaskError,
    });

    if (isError) {
      navigate("/login");
    }
  }, [fetchTaskError, navigate]);

  const deleteTask = async (taskId: string) => {
    try {
      const toastLoading = loadingToast("Deleting Task...");
      const res = await deleteTaskMutation({
        taskId
      }).unwrap();

      dismissToast(toastLoading);

      if (res.success) {
        successToast("Deleted");
        refetch();
      } else {
        errorToast(res?.error || "Deletion failed");
      }
    } catch (err) {
      toast.dismiss();

      const errorMessage =
        (err as { data?: { error?: string }; status?: number })?.data?.error ||
        "Deletion failed";

      errorToast(errorMessage);
    }
  };

  const addTask = async (title: string) => {
    try {
      const toastLoading = loadingToast("Adding Task...");
      const res = await createTaskMutation({
        title,
        userId,
      }).unwrap();

      dismissToast(toastLoading);

      if (res.success) {
        successToast("Added successfully");
        refetch();
      } else {
        errorToast(res?.error || "Adding failed");
      }
    } catch (err) {
      toast.dismiss();

      const errorMessage =
        (err as { data?: { error?: string }; status?: number })?.data?.error ||
        "Adding failed";

      errorToast(errorMessage);
    }
  };

  return (
    <>
      <Header />
      <InputWithButton addTask={addTask} />
      <Statustab />
      <TaskList deleteTask={deleteTask} tasks={data?.tasks} />
    </>
  );
}
