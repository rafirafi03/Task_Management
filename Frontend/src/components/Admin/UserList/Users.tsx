import { useNavigate } from "react-router-dom";
import type{ User } from "../../../Types/userType";

type pageProps = {
  users: User[];
};

export default function UsersList({ users }: pageProps) {
    const navigate = useNavigate()
  return (
    <div className="md:m-30">
      <div className="mt-25 text-white flex justify-center text-xl">Users</div>

      {users?.length == 0 || !users ? (
        <p className="text-gray-500 text-center mt-4">
          No Users found
        </p>
      ) : (

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
        <div className="pb-4 dark:bg-black">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for user"
            />
          </div>
        </div>
        <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3">
                User
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, index)=> (
            <tr key={user._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
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
                {user.name}
              </th>
              <td className="px-6 py-4">
                <p
                  onClick={()=> navigate(`/admin/userDetails/${user._id}`)}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                >
                  View
                </p>
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
