import { useState, useCallback, useMemo } from "react";
import type { Task } from "../../../Types/taskType";
import { errorToast } from "../../../utils/toast";
import type { StatusType } from "../../../Types/statusType";

type Props = {
  tasks: Task[];
  deleteTask: (taskId: string) => void;
  updateTaskStatus?: (taskId: string, status: StatusType) => void;
  updateTaskTitle?: (taskId: string, title: string) => void;
};

export default function TaskList({
  tasks,
  deleteTask,
  updateTaskStatus,
  updateTaskTitle,
}: Props) {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");

  // Memoize static data to prevent recreation
  const statusOptions: StatusType[] = useMemo(() => ["pending", "in-progress", "completed"], []);


  const getStatusColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "in-progress":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  }, []);

  // Memoize handlers to prevent recreation on every render
  const handleDelete = useCallback((taskId: string) => {
    deleteTask(taskId);
    setDropdownOpen(null);
  }, [deleteTask]);

  const handleStatusChange = useCallback((taskId: string, newStatus: StatusType) => {
    if (updateTaskStatus) {
      updateTaskStatus(taskId, newStatus);
    }
    setStatusDropdownOpen(null);
  }, [updateTaskStatus]);

  const handleEditStart = useCallback((taskId: string, currentTitle: string) => {
    setEditingTask(taskId);
    setEditTitle(currentTitle);
    setDropdownOpen(null);
  }, []);

  const handleEditSave = useCallback((taskId: string) => {
    const trimmedTitle = editTitle.trim();

    if (!trimmedTitle || trimmedTitle.length < 3) {
      errorToast("Minimum 3 characters required");
      return;
    }

    if (updateTaskTitle) {
      updateTaskTitle(taskId, trimmedTitle);
    }

    setEditingTask(null);
    setEditTitle("");
  }, [editTitle, updateTaskTitle]);

  const handleEditCancel = useCallback(() => {
    setEditingTask(null);
    setEditTitle("");
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent, taskId: string) => {
    if (e.key === "Enter") {
      handleEditSave(taskId);
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  }, [handleEditSave, handleEditCancel]);

  return (
    <div className="p-3 max-w-5xl mx-auto">
      {tasks?.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">
          No task found, add some
        </p>
      ) : (
        <div className="p-1 relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Task
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks?.map((task) => (
                <tr
                  key={task._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4 text-xs sm:text-sm md:text-base text-gray-900 whitespace-nowrap dark:text-white">
                    {editingTask === task._id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => handleKeyPress(e, task._id)}
                          onBlur={() => handleEditSave(task._id)}
                          className="flex-1 px-2 py-1 text-xs sm:text-sm md:text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                          autoFocus
                        />
                        <button
                          onClick={() => handleEditSave(task._id)}
                          className="p-1 text-green-600 hover:text-green-800 transition-colors duration-150"
                          title="Save"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors duration-150"
                          title="Cancel"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      task.title
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs sm:text-sm md:text-base relative">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setStatusDropdownOpen(
                            statusDropdownOpen === task._id ? null : task._id
                          )
                        }
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          task.status
                        )} hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                      >
                        {task.status}
                        <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {statusDropdownOpen === task._id && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 z-20 mt-2 w-32 origin-top rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 border border-gray-200">
                          <div className="py-1">
                            {statusOptions.map((status) => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(task._id, status as StatusType)}
                                className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors duration-150 ${
                                  task.status === status
                                    ? "bg-blue-50 text-blue-700 font-medium"
                                    : "text-gray-700"
                                }`}
                              >
                                <span className="capitalize">
                                  {status.replace("-", " ")}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs sm:text-sm md:text-base relative">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setDropdownOpen(
                            dropdownOpen === task._id ? null : task._id
                          )
                        }
                        className="text-gray-600 hover:text-blue-600 focus:outline-none transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                          <circle cx="5" cy="12" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="19" cy="12" r="2" />
                        </svg>
                      </button>

                      {dropdownOpen === task._id && (
                        <div className="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={() => handleEditStart(task._id, task.title)}
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(task._id)}
                              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}