import { useState } from "react";
import type { Task } from "../../../Types/taskType";


type Props = {
  tasks: Task[];
  deleteTask: (taskId: string)=> void
};

export default function TaskList({ tasks, deleteTask }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const handleDelete = (taskId: string)=> {
    deleteTask(taskId)
  }

  return (
    <div className="p-3 max-w-5xl mx-auto">
      {tasks?.length == 0 ? (
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
                    {task.title}
                  </td>
                  <td className="px-6 py-4 text-xs sm:text-sm md:text-base">
                    {task.status}
                  </td>
                  <td className="px-6 py-4 text-xs sm:text-sm md:text-base relative">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setDropdownOpen(
                            dropdownOpen === task._id ? null : task._id
                          )
                        }
                        // manage dropdown by ID
                        className="text-white hover:text-blue-300 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          className="w-5 h-5"
                        >
                          <circle cx="5" cy="12" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="19" cy="12" r="2" />
                        </svg>
                      </button>

                      {dropdownOpen === task._id && (
                        <div className="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-md ring-1 ring-black ring-opacity-5">
                          <button
                            onClick={() => {
                              setDropdownOpen(null);
                              console.log("Edit", task._id);
                            }}
                            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                                handleDelete(task._id)
                              console.log("Delete", task._id);
                            }}
                            className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
                          >
                            Delete
                          </button>
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
