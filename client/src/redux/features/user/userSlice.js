import { createSlice } from "@reduxjs/toolkit";

const intialUserState = {
    currentUser: "",
    loading: false,
    error: null,
};

const userSlice = createSlice({
    initialState: intialUserState,
    name: "userInfoSlice",
    reducers: {
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signInStart: (state) => {
            state.loading = true;
        },
    },
});

export default userSlice.reducer;
export const { signFailure, signInStart, signInSuccess } = userSlice.actions;
