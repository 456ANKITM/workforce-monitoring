import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    admin: null,
    isAuthenticated: false, 
    loading: false
};

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setAdmin: (state, action) => {
            state.admin = action.payload;
            state.isAuthenticated = true
        },
        clearAdmin: (state) => {
            state.admin = null;
            state.isAuthenticated = false
        },
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
    }
})

export const {setAdmin, clearAdmin, setLoading} = userSlice.actions;

export default userSlice.reducer;