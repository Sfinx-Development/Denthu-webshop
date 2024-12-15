/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CallbackData,
  CancelRequestOutgoing,
  CaptureResponse,
  OutgoingTransaction,
  PaymentAborted,
  PaymentFailed,
  PaymentOrderIn,
  PaymentOrderIncoming,
  PaymentOrderOutgoing,
  PaymentOrderResponse,
  ReverseRequestOutgoing,
  ValidPaymentOrder,
} from "../../swedbankTypes";
import { getCallbackFromDb } from "../api/callback";
import { PostCancelToInternalApiDB } from "../api/cancel";
import { getCaptureFromDb, PostCaptureToInternalApiDB } from "../api/capture";
import { editOrderInDB } from "../api/order";
import {
  addPaymentOrderIncomingToDB,
  getPaymentOrderFromDB,
} from "../api/paymentOrder";
import { GetReversedStatus, PostReverseToInternalApiDB } from "../api/reverse";
import {
  GetPaymentById,
  GetPaymentPaidValidation,
  PostPaymentOrder,
  PostUpdatePaymentOrder,
} from "../api/swedbank";
import { Order } from "./orderSlice";

interface PaymentState {
  paymentOrderOutgoing: PaymentOrderOutgoing | null;
  paymentOrderIncoming: PaymentOrderIncoming | null;
  checkoutUrl: string | null;
  paymentInfo: ValidPaymentOrder | null;
  paymentFailed: PaymentFailed | null;
  paymentAborted: PaymentAborted | null;
  paymentCancelled: PaymentOrderIn | null;
  paymentCapture: PaymentOrderResponse | null;
  callbackData: CallbackData | null;
  capture: CaptureResponse | null;
  isPaymentOrderReady: boolean;
  error: string | null;
}

export const initialState: PaymentState = {
  paymentOrderOutgoing: null,
  paymentOrderIncoming: getPaymentOrderIncomingFromLocalStorage(),
  checkoutUrl: null,
  paymentInfo: getPaymentInfoFromLocalStorage(),
  paymentFailed: null,
  paymentAborted: null,
  paymentCancelled: getPaymentCancelledFromLocalStorage(),
  paymentCapture: null,
  callbackData: null,
  capture: getCaptureFromLocalStorage(),
  isPaymentOrderReady: false,
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

// CANCEL LOCALSTORAGE
function savePaymentCancelledToLS(paymentInfo: PaymentOrderIn | null) {
  if (paymentInfo) {
    try {
      localStorage.setItem("paymentOrderIn", JSON.stringify(paymentInfo));
    } catch (error) {
      console.error(
        "Error saving cancelled paymentOrderIn to localStorage:",
        error
      );
    }
  } else {
    localStorage.removeItem("paymentOrderIn");
  }
}

// REVERSED LOCALSTORAGE
function savePaymentReversedToLS(paymentInfo: PaymentOrderIn | null) {
  if (paymentInfo) {
    try {
      localStorage.setItem("paymentOrderIn", JSON.stringify(paymentInfo));
    } catch (error) {
      console.error(
        "Error saving cancelled paymentOrderIn to localStorage:",
        error
      );
    }
  } else {
    localStorage.removeItem("paymentOrderIn");
  }
}

function getPaymentCancelledFromLocalStorage(): PaymentOrderIn | null {
  const paymentInfo = localStorage.getItem("paymentOrderIn");

  if (paymentInfo) {
    try {
      return JSON.parse(paymentInfo) as PaymentOrderIn;
    } catch (error) {
      console.error(
        "Error parsing cancelled payment paymentOrderIn from localStorage:",
        error
      );
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

export const updatePaymentOrderOutgoing = createAsyncThunk<
  PaymentOrderIncoming,
  { paymentOrder: PaymentOrderOutgoing; url: string },
  { rejectValue: string }
>(
  "payments/updatePaymentOrderOutgoing",
  async ({ paymentOrder, url }, thunkAPI) => {
    try {
      const response = await PostUpdatePaymentOrder(paymentOrder, url);
      if (response) {
        const paymentOrderIncoming = await addPaymentOrderIncomingToDB(
          response
        );
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
  }
);

export const getPaymentOrderIncoming = createAsyncThunk<
  PaymentOrderIncoming,
  string,
  { rejectValue: string }
>("payments/getPaymentOrderIncoming", async (id, thunkAPI) => {
  try {
    const response = await getPaymentOrderFromDB(id);
    if (response) {
      localStorage.setItem("paymentOrderIncoming", JSON.stringify(response));
      return response;
    } else {
      return thunkAPI.rejectWithValue("failed to get payment order");
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Något gick fel när vi hämtade paymentorder."
    );
  }
});

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
    return thunkAPI.rejectWithValue("failed to get payment validation");
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Något gick fel vid hämtning av betalningsvalidering."
    );
  }
});

export const getPaymentByIdAsync = createAsyncThunk<
  PaymentOrderIncoming,
  { url: string },
  { rejectValue: string }
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
  boolean,
  OutgoingTransaction,
  { rejectValue: string }
>("payments/postOutgoingCapture", async (transaction, thunkAPI) => {
  try {
    const isCaptureOk = await PostCaptureToInternalApiDB({
      transaction: transaction,
    });
    if (isCaptureOk) {
      //hämta capture? <<<<<<<<<<<<<<<
      // saveCaptureToLocalStorage(capture);
      return isCaptureOk;
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
      saveCaptureToLocalStorage(response);
      return response as CaptureResponse;
    } else {
      return thunkAPI.rejectWithValue("failed to get capture");
    }
  } catch (error) {
    return thunkAPI.rejectWithValue("Något gick fel vid hämtning av capture.");
  }
});

// CANCEL
export const makeCancelRequest = createAsyncThunk<
  Order,
  { cancelRequest: CancelRequestOutgoing; cancelUrl: string; order: Order },
  { rejectValue: string }
>(
  "payments/makeCancel",
  async ({ cancelRequest, cancelUrl, order }, thunkAPI) => {
    try {
      const isReversed = await PostCancelToInternalApiDB({
        transaction: cancelRequest,
        cancelUrl,
      });
      if (isReversed) {
        const orderUpdatedPayment: Order = {
          ...order,
          status: "Cancelled",
          // status: response.status
          // paymentInfo: paymentInfo.paymentOrder.paid,
        };
        await editOrderInDB(orderUpdatedPayment);
        // savePaymentCancelledToLS(response);
        return order;
      } else {
        return thunkAPI.rejectWithValue("failed to get cancelled payment");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        "Något gick fel vid hämtning av avbruten betalning."
      );
    }
  }
);

//REVERSE
// export const makeReverseRequest = createAsyncThunk<
//   Order,
//   { reverseRequest: ReverseRequestOutgoing; reverseUrl: string; order: Order },
//   { rejectValue: string }
// >(
//   "payments/makeReverse",
//   async ({ reverseRequest, reverseUrl, order }, thunkAPI) => {
//     try {
//       const isReversed = await PostReverseToInternalApiDB({
//         transaction: reverseRequest,
//         reverseUrl,
//       });
//       if (isReversed) {
//         const orderUpdatedPayment: Order = {
//           ...order,
//           status: "Reversed",
//           // status: response.status
//           // paymentInfo: paymentInfo.paymentOrder.paid,
//         };
//         await editOrderInDB(orderUpdatedPayment);
//         // savePaymentReversedToLS(response);
//         return order;
//       } else {
//         return thunkAPI.rejectWithValue("failed to get reversed payment");
//       }
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         "Något gick fel vid hämtning av återkallad betalning."
//       );
//     }
//   }
// );

export const reversePaymentWithVerification = createAsyncThunk<
  Order,
  {
    reverseRequest: ReverseRequestOutgoing;
    reverseUrl: string;
    order: Order;
    paymentOrder: PaymentOrderIncoming;
  },
  { rejectValue: string }
>(
  "payments/reverseWithVerification",
  async ({ reverseRequest, reverseUrl, order, paymentOrder }, thunkAPI) => {
    try {
      // Initiera reverseringen (POST)
      const isReversed = await PostReverseToInternalApiDB({
        transaction: reverseRequest,
        reverseUrl,
      });

      if (!isReversed) {
        return thunkAPI.rejectWithValue("Failed to initiate reversal.");
      }

      // Verifiera reverseringsstatus (GET)
      const reversedUrl = paymentOrder.paymentOrder.reversed.id;
      // const reversedUrl = `${reverseUrl.replace("/reversal", "/reversed")}`;

      const reversedStatus = await GetReversedStatus(reversedUrl);

      if (reversedStatus?.status === "Reversed") {
        const orderUpdatedPayment: Order = {
          ...order,
          status: "Reversed",
        };
        await editOrderInDB(orderUpdatedPayment);
        return orderUpdatedPayment;
      } else {
        return thunkAPI.rejectWithValue(
          "Reversal not completed. Please try again."
        );
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        "An error occurred during payment reversal."
      );
    }
  }
);

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
    setPaymentOrderReady(state, action) {
      state.isPaymentOrderReady = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(reversePaymentWithVerification.fulfilled, (state, action) => {
      //   const updatedOrder = action.payload;
      //   if (updatedOrder) {
      //     // Uppdatera state baserat på den reverserade ordern
      //     state.paymentInfo = null; // Nollställ eventuell lokal paymentInfo
      //     savePaymentReversedToLS(null); // Ta bort från localStorage
      //     state.error = null;
      //   }
      // })
      // .addCase(reversePaymentWithVerification.rejected, (state, action) => {
      //   state.error = action.payload || "Failed to reverse the payment.";
      // })
      // .addCase(reversePaymentWithVerification.pending, (state) => {
      //   state.error = null; // Rensa tidigare fel vid ny förfrågan
      // })

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
        // state.capture = action.payload;
        state.error = null;
      })
      .addCase(getPaymentOrderIncoming.rejected, (state) => {
        state.error =
          "Något gick fel när paymentorder incoming datan hämtades. Försök igen senare.";
      })
      .addCase(getPaymentOrderIncoming.fulfilled, (state, action) => {
        state.paymentOrderIncoming = action.payload;
        state.error = null;
      });
  },
});

export const {
  clearPaymentOrder,
  clearPaymentInfo,
  clearCallbackData,
  clearCapture,
  setPaymentOrderReady,
} = paymentSlice.actions;
export const PaymentReducer = paymentSlice.reducer;
