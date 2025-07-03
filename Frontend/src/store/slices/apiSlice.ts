import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, HttpMethod } from "../../constants/index";

export const apiSlices = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (postData) => ({
        url: "/signup",
        method: HttpMethod.POST,
        body: postData,
      }),
    }),
    login: builder.mutation({
      query: (postData) => ({
        url: "/login",
        method: HttpMethod.POST,
        body: postData,
      }),
    }),
    adminLogin: builder.mutation({
      query: (postData) => ({
        url: "/admin/login",
        method: HttpMethod.POST,
        body: postData,
      }),
    }),
    createTask: builder.mutation({
      query: (postData) => ({
        url: "/createTask",
        method: HttpMethod.POST,
        body: postData,
      }),
    }),
    updateTask: builder.mutation({
      query: (patchData) => ({
        url: `/updateTask`,
        method: HttpMethod.PATCH,
        body: patchData,
      }),
    }),
    updateStatus: builder.mutation({
      query: (patchData) => ({
        url: `/updateStatus`,
        method: HttpMethod.PATCH,
        body: patchData,
      }),
    }),
    deleteTask: builder.mutation({
      query: (taskId) => ({
        url: "/deleteTask",
        method: HttpMethod.DELETE,
        body: taskId,
      }),
    }),
    fetchTasks: builder.query({
      query: ({ userId, status }) => ({
        url: `/fetchTasks/${userId}${
          status && status !== "all" ? `?status=${status}` : ""
        }`,
        method: HttpMethod.GET,
      }),
    }),
    fetchUsers: builder.query({
      query: () => ({
        url: `/admin/fetchUsers`,
        method: HttpMethod.GET,
      }),
    }),
    fetchUserDetails: builder.query({
      query: (userId) => ({
        url: `/admin/fetchUserDetails/${userId}`,
        method: HttpMethod.GET,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: HttpMethod.POST,
      }),
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: "/admin/logout",
        method: HttpMethod.POST,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateStatusMutation,
  useDeleteTaskMutation,
  useFetchTasksQuery,
  useFetchUsersQuery,
  useFetchUserDetailsQuery,
  useLogoutMutation,
  useAdminLoginMutation,
  useAdminLogoutMutation,
} = apiSlices;
