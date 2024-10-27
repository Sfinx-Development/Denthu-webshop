import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Admin, LogIn } from "../../data/types";
import { signInWithAPI, signOutWithAuth } from "../api/admin";

interface AdminState {
  admin: Admin | null;
  error: string | null;
}

// Check local storage for existing admin data
const storedAdmin = localStorage.getItem("admin");

export const initialState: AdminState = {
  admin: storedAdmin ? JSON.parse(storedAdmin) : null,
  error: null,
};

export const logOutUserAsync = createAsyncThunk("admin/logout", async () => {
  try {
    await signOutWithAuth();
    localStorage.removeItem("admin"); // Remove admin from local storage
  } catch (error) {
    console.error(error);
    throw new Error("Ett fel uppstod vid utloggningen.");
  }
});

export const logInUserAsync = createAsyncThunk<
  Admin,
  LogIn,
  { rejectValue: string }
>("admin/logInUser", async (login) => {
  try {
    const admin = await signInWithAPI(login);
    if (admin) {
      // Store admin in local storage if login is successful
      if (login.keepAlive) {
        localStorage.setItem("admin", JSON.stringify(admin));
      }
    }
    return admin;
  } catch (error) {
    console.error(error);
    throw new Error("Ett fel uppstod vid inloggningen.");
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logInUserAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.admin = action.payload; // Set admin state
          state.error = null;
        }
      })
      .addCase(logInUserAsync.rejected, (state) => {
        state.admin = null; // Clear admin state on failure
        state.error = "Användarnamn eller lösenord är felaktigt.";
      })
      .addCase(logOutUserAsync.fulfilled, (state) => {
        state.admin = null; // Clear admin state on logout
        state.error = null;
      })
      .addCase(logOutUserAsync.rejected, (state) => {
        state.admin = null; // Ensure admin state is cleared on error
      });
  },
});

// Export the admin reducer
export const adminReducer = adminSlice.reducer;
