import Header from "../../components/User/Header/Header";
import InputWithButton from "../../components/User/Input/Input";
import Statustab from "../../components/User/StatusTab/Statustab";
import TaskList from "../../components/User/TaskList/Tasklist";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useFetchTasksQuery,
  useUpdateTaskMutation,
  useUpdateStatusMutation,
} from "../../store/slices/apiSlice";
import {
  loadingToast,
  successToast,
  dismissToast,
  errorToast,
} from "../../utils/toast";
import { toast } from "react-toastify";
import { getUserIdFromToken } from "../../utils/tokenHelper";
import { useCallback, useEffect, useMemo, useState } from "react";
import fetchErrorCheck from "../../utils/fetchErrorCheck";
import { useNavigate } from "react-router-dom";

export type Task = {
  _id: string;
  title: string;
  status: "pending" | "in-progress" | "completed";
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = getUserIdFromToken("token");
    setUserId(id);
  }, []);

  const [activeStatus, setActiveStatus] = useState<string>("all");

  // Local state for optimistic updates
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  // Always fetch all tasks from server with cache invalidation
  const {
    data,
    error: fetchTaskError,
    isLoading,
    isFetching,
    refetch, // Add refetch function
  } = useFetchTasksQuery(
    { userId, status: "all" },
    {
      skip: !userId,
      // Force refetch on mount/user change
      refetchOnMountOrArgChange: true,
      // Disable caching for this query
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const [createTaskMutation] = useCreateTaskMutation();
  const [deleteTaskMutation] = useDeleteTaskMutation();
  const [updateStatusMutation] = useUpdateStatusMutation();
  const [updateTitleMutation] = useUpdateTaskMutation();

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  useEffect(() => {
    if (data?.tasks) {
      setLocalTasks(data.tasks);
    }
  }, [data?.tasks]);

  const handleStatusChange = useCallback((status: string) => {
    setActiveStatus(status);
  }, []);

  const isError = useMemo(() => {
    return fetchErrorCheck({
      fetchError: fetchTaskError,
      tokenName: "token",
    });
  }, [fetchTaskError]);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, [isError, navigate]);

  // Filter tasks based on active status
  const filteredTasks = useMemo(() => {
    if (activeStatus === "all") {
      return localTasks;
    }
    return localTasks.filter((task: Task) => task.status === activeStatus);
  }, [localTasks, activeStatus]);

  const deleteTask = useCallback(
    async (taskId: string) => {
      // Optimistic update - remove from local state immediately
      const originalTasks = [...localTasks];
      setLocalTasks((prev) => prev.filter((task) => task._id !== taskId));

      try {
        const toastLoading = loadingToast("Deleting Task...");
        const res = await deleteTaskMutation({ taskId }).unwrap();

        dismissToast(toastLoading);

        if (res.success) {
          successToast("Deleted");
          // Keep the optimistic update - no need to refetch
        } else {
          // Revert optimistic update on failure
          setLocalTasks(originalTasks);
          errorToast(res?.error || "Deletion failed");
        }
      } catch (err) {
        // Revert optimistic update on error
        setLocalTasks(originalTasks);
        toast.dismiss();

        const errorMessage =
          (err as { data?: { error?: string }; status?: number })?.data
            ?.error || "Deletion failed";

        errorToast(errorMessage);
      }
    },
    [deleteTaskMutation, localTasks]
  );

  const addTask = useCallback(
    async (title: string) => {
      if (!title.trim()) {
        errorToast("Task title cannot be empty");
        return;
      }

      // Create temporary task for optimistic update
      const tempTask: Task = {
        _id: `temp-${Date.now()}`, // Temporary ID
        title: title.trim(),
        status: "pending",
      };

      // Optimistic update - add to local state immediately
      setLocalTasks((prev) => [...prev, tempTask]);

      try {
        const toastLoading = loadingToast("Adding Task...");
        const res = await createTaskMutation({
          title: title.trim(),
          userId,
        }).unwrap();

        dismissToast(toastLoading);

        if (res.success) {
          successToast("Added successfully");
          // Replace temp task with real task from server
          if (res.task) {
            setLocalTasks((prev) =>
              prev.map((task) => (task._id === tempTask._id ? res.task : task))
            );
          }
        } else {
          // Remove temp task on failure
          setLocalTasks((prev) =>
            prev.filter((task) => task._id !== tempTask._id)
          );
          errorToast(res?.error || "Adding failed");
        }
      } catch (err) {
        // Remove temp task on error
        setLocalTasks((prev) =>
          prev.filter((task) => task._id !== tempTask._id)
        );
        toast.dismiss();

        const errorMessage =
          (err as { data?: { error?: string }; status?: number })?.data
            ?.error || "Adding failed";

        errorToast(errorMessage);
      }
    },
    [createTaskMutation, userId]
  );

  const handleStatusUpdate = useCallback(
    async (taskId: string, status: "pending" | "in-progress" | "completed") => {
      // Validate status
      if (!["pending", "in-progress", "completed"].includes(status)) {
        errorToast("Invalid status");
        return;
      }

      // Find the task to update
      const taskToUpdate = localTasks.find((task) => task._id === taskId);
      if (!taskToUpdate) {
        errorToast("Task not found");
        return;
      }

      const originalStatus = taskToUpdate.status;

      // Optimistic update - update status immediately
      setLocalTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: status } : task
        )
      );

      try {
        const toastLoading = loadingToast("Updating Status...");
        const res = await updateStatusMutation({
          taskId,
          status: status,
        }).unwrap();

        dismissToast(toastLoading);

        if (res.success) {
          successToast("Status updated");
          // Keep the optimistic update
        } else {
          // Revert optimistic update on failure
          setLocalTasks((prev) =>
            prev.map((task) =>
              task._id === taskId ? { ...task, status: originalStatus } : task
            )
          );
          errorToast(res?.error || "Update failed");
        }
      } catch (err) {
        // Revert optimistic update on error
        setLocalTasks((prev) =>
          prev.map((task) =>
            task._id === taskId ? { ...task, status: originalStatus } : task
          )
        );
        toast.dismiss();

        const errorMessage =
          (err as { data?: { error?: string }; status?: number })?.data
            ?.error || "Update failed";

        errorToast(errorMessage);
      }
    },
    [updateStatusMutation, localTasks]
  );

  const handleTitleUpdate = useCallback(
    async (taskId: string, newTitle: string) => {
      if (!newTitle.trim()) {
        errorToast("Task title cannot be empty");
        return;
      }

      // Find the task to update
      const taskToUpdate = localTasks.find((task) => task._id === taskId);
      if (!taskToUpdate) {
        errorToast("Task not found");
        return;
      }

      const originalTitle = taskToUpdate.title;

      // Optimistic update - update title immediately
      setLocalTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, title: newTitle.trim() } : task
        )
      );

      try {
        const toastLoading = loadingToast("Updating Task...");
        const res = await updateTitleMutation({
          taskId,
          title: newTitle.trim(),
        }).unwrap();

        dismissToast(toastLoading);

        if (res.success) {
          successToast("Task updated");
          // Keep the optimistic update
        } else {
          // Revert optimistic update on failure
          setLocalTasks((prev) =>
            prev.map((task) =>
              task._id === taskId ? { ...task, title: originalTitle } : task
            )
          );
          errorToast(res?.error || "Update failed");
        }
      } catch (err) {
        // Revert optimistic update on error
        setLocalTasks((prev) =>
          prev.map((task) =>
            task._id === taskId ? { ...task, title: originalTitle } : task
          )
        );
        toast.dismiss();

        const errorMessage =
          (err as { data?: { error?: string }; status?: number })?.data
            ?.error || "Update failed";

        errorToast(errorMessage);
      }
    },
    [updateTitleMutation, localTasks]
  );

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading tasks...</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <InputWithButton addTask={addTask} />
      <Statustab
        activeStatus={activeStatus}
        onStatusChange={handleStatusChange}
      />
      <TaskList
        deleteTask={deleteTask}
        tasks={filteredTasks}
        updateTaskStatus={handleStatusUpdate}
        updateTaskTitle={handleTitleUpdate}
      />
    </>
  );
}
