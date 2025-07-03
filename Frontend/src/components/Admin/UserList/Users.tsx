import { useNavigate } from "react-router-dom";
import type { User } from "../../../Types/userType";

type pageProps = {
  users: User[];
};

export default function UsersList({ users }: pageProps) {
  const navigate = useNavigate();
  return (
    <div className="md:m-30">
      <div className="mt-25 text-white flex justify-center text-xl">Users</div>

      {users?.length == 0 || !users ? (
        <p className="text-gray-500 text-center mt-4">No Users found</p>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
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
              {users?.map((user, index) => (
                <tr
                  key={user._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {index + 1}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {user.name}
                  </th>
                  <td className="px-6 py-4">
                    <p
                      onClick={() => navigate(`/admin/userDetails/${user._id}`)}
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
