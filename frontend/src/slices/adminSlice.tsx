// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { Admin, LogIn } from "../../data/types";
// import { signInWithAPI, signOutWithAuth } from "../api/admin";

// interface AdminState {
//   admin: Admin | undefined;
//   error: string | null;
// }

// export const initialState: AdminState = {
//   admin: undefined,
//   error: null,
// };

// export const logOutUserAsync = createAsyncThunk("admin/logout", async () => {
//   try {
//     await signOutWithAuth();
//   } catch (error) {
//     console.error(error);
//     throw new Error("Ett fel uppstod vid utloggningen.");
//   }
// });

// export const logInUserAsync = createAsyncThunk<
//   Admin,
//   LogIn,
//   { rejectValue: string }
// >("admin/logInUser", async (login, thunkAPI) => {
//   try {
//     const admin = await signInWithAPI(login);
//     return admin;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Ett fel uppstod vid inloggningen.");
//   }
// });

// const adminSlice = createSlice({
//   name: "admin",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(logInUserAsync.fulfilled, (state, action) => {
//         if (action.payload) {
//           state.admin = action.payload;
//           state.error = null;
//         }
//       })
//       .addCase(logInUserAsync.rejected, (state) => {
//         state.admin = undefined;
//         state.error = "Användarnamn eller lösenord är felaktigt.";
//       });
//   },
// });

// export const adminReducer = adminSlice.reducer;
