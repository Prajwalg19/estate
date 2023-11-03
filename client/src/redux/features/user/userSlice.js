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
            if (action?.payload?.OAuth == "OAuth") {
                state.OAuthLoading = false;
                state.currentUser = action.payload.data;
            } else {
                state.currentUser = action.payload;
            }
            state.loading = false;
            state.error = null;
        },
        signFailure: (state, action) => {
            if (action?.payload?.OAuth == "OAuth") {
                state.OAuthLoading = false;
                state.error = action.payload.error;
            } else {
                state.error = action.payload;
            }

            state.loading = false;
        },
        signInStart: (state, action) => {
            state.error = null;
            if (action.payload?.OAuth == "OAuth") state.OAuthLoading = true;
            else state.loading = true;
        },
    },
});

export default userSlice.reducer;
export const { signFailure, signInStart, signInSuccess } = userSlice.actions;
