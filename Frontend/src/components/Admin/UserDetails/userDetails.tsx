import type { Task } from "../../../Types/taskType";

type pageProps = {
    tasks : Task[]
}

export default function UserDetails({tasks}:pageProps) {
  return (
    <div className="md:m-30">
      <div className="mt-25 text-white flex justify-center text-xl">
        User Tasks
      </div>

    {tasks?.length == 0 || !tasks ? (
        <p className="text-gray-500 text-center mt-4">
          No Tasks found
        </p>
      ) : (
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
        <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3">
                Task
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task, index)=> (
            <tr key={task._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {index+1}
              </th>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {task.title}
              </th>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {task.status}
              </th>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
