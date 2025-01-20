import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'userType',
    initialState: { isGuest: false },
    reducers: {
        set: (state, action) => {
            state.isGuest = action.payload;
        }
    },
});

export const { set } = userSlice.actions;
export default userSlice.reducer;