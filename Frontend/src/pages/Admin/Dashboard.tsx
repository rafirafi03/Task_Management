import UsersList from "../../components/Admin/UserList/Users";
import Header from "../../components/Admin/Header/Header";
import { useFetchUsersQuery } from "../../store/slices/apiSlice";
import { useEffect, useMemo } from "react";
import fetchErrorCheck from "../../utils/fetchErrorCheck";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    error: fetchUserError,
  } = useFetchUsersQuery(undefined);

  const isError = useMemo(() => {
    return fetchErrorCheck({
      fetchError: fetchUserError,
      tokenName: "adminToken",
    });
  }, [fetchUserError]);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, [isError, navigate]);

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

  if (fetchUserError) {
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
