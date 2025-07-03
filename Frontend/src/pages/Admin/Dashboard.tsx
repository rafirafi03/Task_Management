import UsersList from "../../components/Admin/UserList/Users";
import Header from "../../components/Admin/Header/Header";
import { useFetchUsersQuery } from "../../store/slices/apiSlice";
import { useMemo } from "react";

export default function Dashboard() {
  const { data, isLoading, error } = useFetchUsersQuery(undefined);


  const users = useMemo(() => data?.users, [data?.users]);


  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading users...</div>
        </div>
      </>
    );
  }


  if (error) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Error loading users</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <UsersList users={users} />
    </>
  );
}