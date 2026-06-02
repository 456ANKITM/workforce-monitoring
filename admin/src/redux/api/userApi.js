import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const userApi = createApi({
    reducerPath:"userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/user`,
        credentials:'include',
    }),
    endpoints: (builder) => ({
     onlineEmployees: builder.query({
      query: () => ({
        url: "/online-employees",
        method: "GET",
      }),
    }),
    })
})

export const {useOnlineEmployeesQuery} = userApi