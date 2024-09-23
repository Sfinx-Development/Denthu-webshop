/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CallbackData,
  CaptureResponse,
  OutgoingTransaction,
  PaymentAborted,
  PaymentCancelled,
  PaymentFailed,
  PaymentOrderIncoming,
  PaymentOrderResponse,
  ValidPaymentOrder,
} from "../../swedbankTypes";
import { PaymentOrderOutgoing } from "../../types";
import { getCallbackFromDb } from "../api/callback";
import { getCaptureFromDb, PostCaptureToInternalApiDB } from "../api/capture";
import { addPaymentOrderIncomingToDB } from "../api/paymentOrder";
import {
  CapturePayment,
  GetPaymentById,
  GetPaymentPaidValidation,
  PostPaymentOrder,
} from "../api/swedbank";

interface PaymentState {
  paymentOrderOutgoing: PaymentOrderOutgoing | null;
  paymentOrderIncoming: PaymentOrderIncoming | null;
  checkoutUrl: string | null;
  paymentInfo: ValidPaymentOrder | null;
  paymentFailed: PaymentFailed | null;
  paymentAborted: PaymentAborted | null;
  paymentCancelled: PaymentCancelled | null;
  paymentCapture: PaymentOrderResponse | null;
  callbackData: CallbackData | null;
  capture: CaptureResponse | null;
  error: string | null;
}

export const initialState: PaymentState = {
  paymentOrderOutgoing: null,
  paymentOrderIncoming: getPaymentOrderIncomingFromLocalStorage(),
  checkoutUrl: null,
  paymentInfo: getPaymentInfoFromLocalStorage(),
  paymentFailed: null,
  paymentAborted: null,
  paymentCancelled: null,
  paymentCapture: null,
  callbackData: null,
  capture: getCaptureFromLocalStorage(),
  error: null,
};

function getPaymentOrderIncomingFromLocalStorage(): PaymentOrderIncoming | null {
  const paymentOrderIncoming = localStorage.getItem("paymentOrderIncoming");

  if (paymentOrderIncoming) {
    try {
      return JSON.parse(paymentOrderIncoming) as PaymentOrderIncoming;
    } catch (error) {
      console.error(
        "Error parsing paymentOrderIncoming from localStorage:",
        error
      );
      return null;
    }
  }
  return null;
}

function savePaymentInfoToLocalStorage(paymentInfo: ValidPaymentOrder | null) {
  if (paymentInfo) {
    try {
      localStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));
    } catch (error) {
      console.error("Error saving paymentInfo to localStorage:", error);
    }
  } else {
    localStorage.removeItem("paymentInfo");
  }
}

function getPaymentInfoFromLocalStorage(): ValidPaymentOrder | null {
  const paymentInfo = localStorage.getItem("paymentInfo");

  if (paymentInfo) {
    try {
      return JSON.parse(paymentInfo) as ValidPaymentOrder;
    } catch (error) {
      console.error("Error parsing paymentInfo from localStorage:", error);
      return null;
    }
  }

  return null;
}

function saveCaptureToLocalStorage(capture: CaptureResponse | null) {
  if (capture) {
    try {
      localStorage.setItem("capture", JSON.stringify(capture));
    } catch (error) {
      console.error("Error saving capture to localStorage:", error);
    }
  } else {
    localStorage.removeItem("capture");
  }
}

function getCaptureFromLocalStorage(): CaptureResponse | null {
  const capture = localStorage.getItem("capture");

  if (capture) {
    try {
      return JSON.parse(capture) as CaptureResponse;
    } catch (error) {
      console.error("Error parsing capture from localStorage:", error);
      return null;
    }
  }

  return null;
}

export const addPaymentOrderOutgoing = createAsyncThunk<
  PaymentOrderIncoming,
  PaymentOrderOutgoing,
  { rejectValue: string }
>("payments/addPaymentOrderOutgoing", async (paymentOrder, thunkAPI) => {
  try {
    const response = await PostPaymentOrder(paymentOrder);
    if (response) {
      const paymentOrderIncoming = await addPaymentOrderIncomingToDB(response);
      if (paymentOrderIncoming) {
        return paymentOrderIncoming;
      } else {
        return thunkAPI.rejectWithValue("failed to create payment ordcer");
      }
    } else {
      return thunkAPI.rejectWithValue("failed to create payment ordcer");
    }
  } catch (error) {
    throw new Error("Något gick fel vid .");
  }
});

// export const getPaymentOrderIncoming = createAsyncThunk<
//   PaymentOrderIncoming,
//   string,
//   { rejectValue: string }
// >("payments/getPaymentOrderIncoming", async (orderReference, thunkAPI) => {
//   try {
//     const response = await getPaymentOrderFromDBByReference(orderReference);
//     if (response) {
//       return response;
//     } else {
//       return thunkAPI.rejectWithValue("failed to create payment ordcer");
//     }
//   } catch (error) {
//     throw new Error("Något gick fel vid .");
//   }
// });
export const getPaymentPaidValidation = createAsyncThunk<
  ValidPaymentOrder,
  PaymentOrderIncoming,
  { rejectValue: string }
>("payments/getPaymentValidation", async (order, thunkAPI) => {
  try {
    const response = await GetPaymentPaidValidation(order.paymentOrder.paid.id);
    if (response) {
      savePaymentInfoToLocalStorage(response);
      return response;
    }
    // const failed = await GetPaymentFailedValidation(
    //   order.paymentOrder.failed.id
    // );
    // if (failed) {
    //   return failed;
    // }
    // const aborted = await GetPaymentAbortedValidation(
    //   order.paymentOrder.aborted.id
    // );
    // if (aborted) {
    //   return aborted;
    // }

    // const cancelled = await GetPaymentCancelledValidation(
    //   order.paymentOrder.cancelled.id
    // );
    // if (cancelled) {
    //   return cancelled;
    // }

    return thunkAPI.rejectWithValue("failed to get payment validation");
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Något gick fel vid hämtning av betalningsvalidering."
    );
  }
});

export const getPaymentCaptureAsync = createAsyncThunk<
  PaymentOrderResponse, // Return type
  { transaction: OutgoingTransaction; url: string },
  { rejectValue: string } // ThunkAPI type
>("payments/getPaymentCaptureAsync", async ({ transaction, url }, thunkAPI) => {
  try {
    const response = await CapturePayment({
      transaction: transaction,
      captureUrl: url,
    });
    if (response) {
      return response;
    } else {
      return thunkAPI.rejectWithValue("failed to capture payment");
    }
  } catch (error) {
    throw new Error("Något gick fel vid Betalning (Capture).");
  }
});

export const getPaymentByIdAsync = createAsyncThunk<
  PaymentOrderIncoming, // Return type
  { url: string },
  { rejectValue: string } // ThunkAPI type
>("payments/getPaymentById", async ({ url }, thunkAPI) => {
  try {
    const response = await GetPaymentById(url);
    if (response) {
      return response;
    } else {
      return thunkAPI.rejectWithValue("failed to capture payment");
    }
  } catch (error) {
    throw new Error("Något gick fel vid Betalning (Capture).");
  }
});

export const postCaptureToInternalApi = createAsyncThunk<
  CaptureResponse,
  OutgoingTransaction,
  { rejectValue: string }
>("payments/postOutgoingCapture", async (transaction, thunkAPI) => {
  try {
    const capture = await PostCaptureToInternalApiDB({
      transaction: transaction,
    });
    if (capture) {
      saveCaptureToLocalStorage(capture);
      return capture;
    } else {
      return thunkAPI.rejectWithValue("failed to capture payment");
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Något gick fel vid post av outgoing transaction för att göra capture."
    );
  }
});

export const getCallbackAsync = createAsyncThunk<
  CallbackData,
  string,
  { rejectValue: string }
>("payments/getCallback", async (orderReference, thunkAPI) => {
  try {
    const response = await getCallbackFromDb(orderReference);
    if (response) {
      return response;
    }
    return thunkAPI.rejectWithValue("failed to get callbackdata");
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Något gick fel vid hämtning av callbackdata."
    );
  }
});

export const getCaptureAsync = createAsyncThunk<
  CaptureResponse,
  string,
  { rejectValue: string }
>("payments/getCapture", async (paymentOrderId, thunkAPI) => {
  try {
    const response = await getCaptureFromDb(paymentOrderId);
    if (response) {
      console.log(response);
      saveCaptureToLocalStorage(response);
      return response as CaptureResponse;
    } else {
      return thunkAPI.rejectWithValue("failed to get capture");
    }
  } catch (error) {
    return thunkAPI.rejectWithValue("Något gick fel vid hämtning av capture.");
  }
});

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    clearPaymentOrder: (state) => {
      state.paymentOrderIncoming = null;
      localStorage.removeItem("paymentOrderIncoming");
    },
    clearPaymentInfo: (state) => {
      state.paymentInfo = null;
      localStorage.removeItem("paymentInfo");
    },
    clearCallbackData: (state) => {
      state.callbackData = null;
      localStorage.removeItem("callbacks");
    },
    clearCapture: (state) => {
      state.capture = null;
      localStorage.removeItem("capture");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPaymentOrderOutgoing.fulfilled, (state, action) => {
        if (action.payload) {
          state.paymentOrderIncoming = action.payload;
          localStorage.setItem(
            "paymentOrderIncoming",
            JSON.stringify(action.payload)
          );
          state.error = null;
        }
      })
      .addCase(addPaymentOrderOutgoing.rejected, (state) => {
        state.error =
          "Något gick fel när payment ordern hämtades. Försök igen senare.";
      })
      .addCase(getPaymentPaidValidation.fulfilled, (state, action) => {
        state.paymentInfo = action.payload;
        state.error = null;
      })
      .addCase(getPaymentPaidValidation.rejected, (state) => {
        state.error =
          "Något gick fel när validering av betalning hämtades. Försök igen senare.";
      })
      .addCase(getPaymentCaptureAsync.fulfilled, (state, action) => {
        if (action.payload) {
          console.log("CAPTURE SVARET: ", action.payload);
          state.paymentCapture = action.payload;
          state.error = null;
        }
      })
      .addCase(getPaymentCaptureAsync.rejected, (state) => {
        state.error = "Något gick fel när betalning bearbetades.";
      })
      .addCase(getCallbackAsync.rejected, (state) => {
        state.error =
          "Något gick fel när callback datan hämtades. Försök igen senare.";
      })
      .addCase(getCallbackAsync.fulfilled, (state, action) => {
        state.callbackData = action.payload;
        state.error = null;
      })
      .addCase(postCaptureToInternalApi.rejected, (state) => {
        state.error =
          "Något gick fel när callback datan hämtades. Försök igen senare.";
      })
      .addCase(postCaptureToInternalApi.fulfilled, (state, action) => {
        state.capture = action.payload;
        state.error = null;
      });
  },
});

export const {
  clearPaymentOrder,
  clearPaymentInfo,
  clearCallbackData,
  clearCapture,
} = paymentSlice.actions;
export const PaymentReducer = paymentSlice.reducer;
