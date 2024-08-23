/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import {
//   PaymentAborted,
//   PaymentCancelled,
//   PaymentFailed,
// } from "../../swedbankTypes";
import { PaymentOrderIncoming, PaymentOrderOutgoing } from "../../types";

// import {
//   GetPaymentAbortedValidation,
//   GetPaymentCancelledValidation,
//   GetPaymentFailedValidation,
//   GetPaymentPaidValidation,
//   PostPaymentOrder,
// } from "../api/SWEDBANKpaymentOrder";
import {
  addPaymentOrderIncomingToDB,
  getPaymentOrderFromDBByReference,
} from "../api/paymentOrder";

export interface PaymentDetails {
  msisdn: string;
}

export interface PaymentInfo {
  id: string;
  number: number;
  instrument: string;
  payeeReference: string;
  orderReference: string;
  transactionType: string;
  amount: number;
  submittedAmount: number;
  feeAmount: number;
  discountAmount: number;
  paymentTokenGenerated: boolean;
  details: PaymentDetails;
}

interface PaymentState {
  paymentOrderOutgoing: PaymentOrderOutgoing | null;
  paymentOrderIncoming: PaymentOrderIncoming | null;
  checkoutUrl: string | null;
  paymentInfo: PaymentInfo | null;
//   paymentFailed: PaymentFailed | null;
//   paymentAborted: PaymentAborted | null;
//   paymentCancelled: PaymentCancelled | null;
  error: string | null;
}

export const initialState: PaymentState = {
  paymentOrderOutgoing: null,
  paymentOrderIncoming: getPaymentOrderIncomingFromLocalStorage(),
  checkoutUrl: null,
  paymentInfo: null,
//   paymentFailed: null,
//   paymentAborted: null,
//   paymentCancelled: null,
  error: null,
};

export default function getPaymentOrderIncomingFromLocalStorage(): PaymentOrderIncoming | null {
  const paymentOrderIncoming = localStorage.getItem("paymentOrderIncoming");

  if (paymentOrderIncoming) {
    try {
      return JSON.parse(paymentOrderIncoming)
        .paymentOrder as PaymentOrderIncoming;
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

// export const addPaymentOrderOutgoing = createAsyncThunk<
//   PaymentOrderIncoming,
//   PaymentOrderOutgoing,
//   { rejectValue: string }
// >("payments/addPaymentOrderOutgoing", async (paymentOrder, thunkAPI) => {
  try {
    // const response = await PostPaymentOrder(paymentOrder);
    // if (response) {
    //   const paymentOrderIncoming = await addPaymentOrderIncomingToDB(response);
    //   if (paymentOrderIncoming) {
    //     return paymentOrderIncoming;
    //   } else {
    //     return thunkAPI.rejectWithValue("failed to create payment ordcer");
    //   }
    // } else {
    //   return thunkAPI.rejectWithValue("failed to create payment ordcer");
    // }
  } catch (error) {
    throw new Error("Något gick fel vid .");
  }
// });

export const getPaymentOrderIncoming = createAsyncThunk<
  PaymentOrderIncoming,
  string,
  { rejectValue: string }
>("payments/getPaymentOrderIncoming", async (orderReference, thunkAPI) => {
  try {
    const response = await getPaymentOrderFromDBByReference(orderReference);
    if (response) {
      return response;
    } else {
      return thunkAPI.rejectWithValue("failed to create payment ordcer");
    }
  } catch (error) {
    throw new Error("Något gick fel vid .");
  }
});
// export const getPaymentPaidValidation = createAsyncThunk<
//   PaymentInfo | PaymentAborted | PaymentCancelled | PaymentFailed,
//   PaymentOrderIncoming,
//   { rejectValue: string }
// >("payments/getPaymentValidation", async (order, thunkAPI) => {
//   try {
//     const response = await GetPaymentPaidValidation(order.paid.id);
//     if (response) {
//       return response;
//     }

    // const failed = await GetPaymentFailedValidation(order.failed.id);
    // if (failed) {
    //   return failed;
    // }

    // const aborted = await GetPaymentAbortedValidation(order.aborted.id);
    // if (aborted) {
    //   return aborted;
    // }

    // const cancelled = await GetPaymentCancelledValidation(order.cancelled.id);
    // if (cancelled) {
    //   return cancelled;
    // }

//     return thunkAPI.rejectWithValue("failed to get payment validation");
//   } catch (error) {
//     return thunkAPI.rejectWithValue(
//       "Något gick fel vid hämtning av betalningsvalidering."
//     );
//   }
// });

// const paymentSlice = createSlice({
//   name: "payments",
//   initialState,
//   reducers: {
//     clearPaymentOrder: (state) => {
//       state.paymentOrderIncoming = null;
//       localStorage.removeItem("paymentOrderIncoming");
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(addPaymentOrderOutgoing.fulfilled, (state, action) => {
//         if (action.payload) {
//           state.paymentOrderIncoming = action.payload;
//           localStorage.setItem(
//             "paymentOrderIncoming",
//             JSON.stringify(action.payload)
//           );
//           state.error = null;
//         }
//       })
//       .addCase(addPaymentOrderOutgoing.rejected, (state) => {
//         state.error =
//           "Något gick fel när payment ordern hämtades. Försök igen senare.";
//       })
//       .addCase(getPaymentOrderIncoming.fulfilled, (state, action) => {
//         if (action.payload) {
//           state.paymentOrderIncoming = action.payload;
//           state.error = null;
//         }
//       })
//       .addCase(getPaymentOrderIncoming.rejected, (state) => {
//         state.error =
//           "Något gick fel när payment ordern hämtades. Försök igen senare.";
//       })
    //   .addCase(getPaymentPaidValidation.fulfilled, (state, action) => {
    //     const payload = action.payload;
    //     console.log("PAYLOAD: ", action.payload);

    //     if ("paid" in payload) {
    //       state.paymentInfo = payload as PaymentInfo;
    //       console.log("SÄTTS SOM PAYMENTINFO");
    //     } else if ("abortReason" in payload) {
    //       state.paymentAborted = payload as PaymentAborted;
    //     } else if ("cancelReason" in payload) {
    //       state.paymentCancelled = payload as unknown as PaymentCancelled;
    //     } else if ("problem" in payload) {
    //       state.paymentFailed = payload as PaymentFailed;
    //     } else {
    //       state.error = "Unknown payment status";
    //     }
    //   })
//       .addCase(getPaymentPaidValidation.rejected, (state) => {
//         state.error =
//           "Något gick fel när validering av betalning hämtades. Försök igen senare.";
//       });
//   },
// });

// export const { clearPaymentOrder } = paymentSlice.actions;
// export const PaymentReducer = paymentSlice.reducer;
