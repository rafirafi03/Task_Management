import { useCallback } from "react";

interface StatustabProps {
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

export default function Statustab({ activeStatus, onStatusChange }: StatustabProps) {
  const handleStatusClick = useCallback((status: string) => {
    onStatusChange(status);
  }, [onStatusChange]);

  const statuses = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" }
  ];

  return (
    <div className="flex justify-center text-sm font-medium text-center text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700 mt-10">
      <ul className="flex flex-wrap -mb-px">
        {statuses.map((status) => (
          <li key={status.value} className="me-2">
            <a
              onClick={() => handleStatusClick(status.value)}
              className={`inline-block p-4 border-transparent rounded-t-lg cursor-pointer hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${
                activeStatus === status.value 
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500" 
                  : ""
              }`}
            >
              {status.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}