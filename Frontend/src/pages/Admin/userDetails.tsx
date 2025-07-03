import Header from "../../components/Admin/Header/Header";
import UserDetails from "../../components/Admin/UserDetails/userDetails";
import { useParams } from "react-router-dom";
import { useFetchUserDetailsQuery } from "../../store/slices/apiSlice";
import { useMemo } from "react";

export default function UserDetail() {
  const { userId } = useParams();
  
  const { data, isLoading, error } = useFetchUserDetailsQuery(userId, {
    skip: !userId,
  });

  const tasks = useMemo(() => data?.tasks, [data?.tasks]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading user details...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Error loading user details</div>
        </div>
      </>
    );
  }

  if (!userId) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-yellow-500">No user ID provided</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <UserDetails tasks={tasks} />
    </>
  );
}