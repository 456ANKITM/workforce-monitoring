import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/user`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    updateLiveLocation: builder.mutation({
      query: (data) => ({
        url: "/location/live",
        method: "POST",
        body: data,
      }),
    }),
    updateLocationHistory: builder.mutation({
      query: (data) => ({
        url: "/location/history",
        method: "POST",
        body: data,
      }),
    }),
    enableLocation: builder.mutation({
      query: () => ({
        url: "/location/enable",
        method: "PUT",
      }),
    }),

    disableLocation: builder.mutation({
      query: () => ({
        url: "/location/disable",
        method: "PUT",
      }),
    }),
    enableCamera: builder.mutation({
      query:() => ({
        url:"/camera/enable",
        method:'PUT'
      })
    }),
    disableCamera: builder.mutation({
      query:() => ({
        url:"/camera/disable",
        method:"PUT"
      })
    })
  }),
});

export const {
  useUpdateLiveLocationMutation,
  useUpdateLocationHistoryMutation,
  useEnableLocationMutation,
  useDisableLocationMutation,
  useEnableCameraMutation,
  useDisableCameraMutation
} = userApi;
