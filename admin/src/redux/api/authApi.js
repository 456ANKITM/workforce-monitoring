import { Data } from "@react-google-maps/api"
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/auth`,
        credentials:'include',
    }),
    endpoints: (builder) => ({
       adminSignup: builder.mutation({
        query: (data) => ({
            url:"/admin/signup",
            method:'POST',
            body:data
        })
       }),
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
       createEmployee: builder.mutation({
        query: (data) => ({
            url:"/create-employee",
            method:'POST',
            body:data
        })
       })
        
    })
})

export const {useAdminSignupMutation, useGetMeQuery, useLoginMutation, useCreateEmployeeMutation} = authApi