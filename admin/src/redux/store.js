import {configureStore} from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import userReducer from "./slices/userSlice"


export const store = configureStore({
    reducer:{
         user: userReducer,
         [authApi.reducerPath] : authApi.reducer,
         [userApi.reducerPath] : userApi.reducer,
    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware).concat(userApi.middleware)
})