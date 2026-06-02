import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/auth`,
        credentials:'include',
    }),
    endpoints: (builder) => ({
       getMe: builder.query ({
        query: () => ({
            url:"/get-me"
        })
       }),
       login: builder.mutation ({
        query: (data) => ({
            url:"/login",
            method:'POST',
            body:data 
        })
       }), 
    })
})

export const {useGetMeQuery, useLoginMutation} = authApi