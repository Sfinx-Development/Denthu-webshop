import {
  CancelRequestOutgoing,
  PaymentOrderIn,
  PaymentOrderIncoming,
  PaymentOrderOutgoing,
  ValidPaymentOrder,
} from "../../swedbankTypes";

export async function PostPaymentOrder(paymentOrder: PaymentOrderOutgoing) {
  const uri = "https://api.externalintegration.payex.com/psp/paymentorders";
  const requestBody = {
    paymentOrder,
  };
  const bearer = import.meta.env.VITE_SWEDBANK_BEARER;
  // const sessionId = import.meta.env.VITE_SWEDBANK_SESSIONID;
  console.log("PAYMENT ORDER REQUEST: ", requestBody);
  return fetch(uri, {
    method: "POST",
    headers: {
      ContentType: "application/json;version=3.1",
      Authorization: `Bearer ${bearer}`,
      Host: "api.externalintegration.payex.com",
      // "Session-Id": sessionId,
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Nätverksfel - ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data as PaymentOrderIncoming;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

export async function PostUpdatePaymentOrder(
  paymentOrder: PaymentOrderOutgoing,
  url: string
) {
  const uri = url;
  const requestBody = {
    paymentOrder,
  };
  const bearer = import.meta.env.VITE_SWEDBANK_BEARER;
  // const sessionId = import.meta.env.VITE_SWEDBANK_SESSIONID;
  return fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;version=3.1",
      Authorization: `Bearer ${bearer}`,
      Host: "api.externalintegration.payex.com",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Nätverksfel - ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data as PaymentOrderIncoming;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

export async function GetPaymentPaidValidation(paidUrl: string) {
  const uri = paidUrl;
  const bearer = import.meta.env.VITE_SWEDBANK_BEARER;
  const expandedNodeUrl = uri.replace("/paid", "?$expand=paid");
  // const sessionId = import.meta.env.VITE_SWEDBANK_SESSIONID;
  return fetch(expandedNodeUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;version=3.1",
      Authorization: `Bearer ${bearer}`,
      // "User-Agent": "swedbankpay-sdk-dotnet/3.0.1",
      // Accept: "application/problem+json; q=1.0, application/json; q=0.9",
      // "Session-Id": sessionId,
      // Forwarded: "for=192.168.1.157; host=https://localhost:5173; proto=https",
      Host: "api.externalintegration.payex.com",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Nätverksfel - ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data as ValidPaymentOrder;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

export async function GetPaymentById(urlId: string) {
  const uri = urlId;
  const bearer = import.meta.env.VITE_SWEDBANK_BEARER;
  // const sessionId = import.meta.env.VITE_SWEDBANK_SESSIONID;
  return fetch(uri, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;version=3.1",
      Authorization: `Bearer ${bearer}`,
      Host: "api.externalintegration.payex.com",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Nätverksfel - ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data as PaymentOrderIncoming;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

// export async function CapturePayment({
//   transaction,
//   captureUrl,
// }: {
//   transaction: OutgoingTransaction;
//   captureUrl: string;
// }): Promise<PaymentOrderResponse | null> {
//   const uri = captureUrl;
//   const requestBody = {
//     transaction: transaction,
//     // orderItems: transaction.orderItems,
//   };
//   const bearer = import.meta.env.VITE_SWEDBANK_BEARER;

//   console.log("Request URI: ", uri);
//   console.log("Request Body: ", requestBody);
//   // const sessionId = import.meta.env.VITE_SWEDBANK_SESSIONID;
//   return fetch(uri, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json;version=3.1",
//       Authorization: `Bearer ${bearer}`,
//       Host: "api.externalintegration.payex.com",
//       // "Access-Control-Max-Age": "1000",
//       // "User-Agent": "swedbankpay-sdk-dotnet/3.0.1",
//       // Accept: "application/problem+json; q=1.0, application/json; q=0.9",
//       // "Session-Id": sessionId,
//       // Forwarded: "host=https://localhost:5173; proto=https",
//     },
//     body: JSON.stringify(requestBody),
//   })
//     .then((response) => {
//       console.log("Response Status: ", response.status);
//       if (!response.ok) {
//         return response.text().then((text) => {
//           throw new Error(`Nätverksfel - ${response.status}: ${text}`);
//         });
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log("Response Data: ", data);
//       return data as PaymentOrderResponse;
//     })
//     .catch((error) => {
//       console.error("Error in CapturePayment: ", error);
//       return null;
//     });
// }

// CANCEL REQUEST - INNAN BETALNINGEN ÄR CAPTURED ENDAST
export async function CancelRequest({
  cancelRequestOutgoing,
  cancelUrl,
}: {
  cancelRequestOutgoing: CancelRequestOutgoing;
  cancelUrl: string;
}): Promise<PaymentOrderIn | null> {
  const uri = cancelUrl;
  const requestBody = {
    transaction: {
      description: cancelRequestOutgoing.description,
      payeeReference: cancelRequestOutgoing.payeeReference,
    },
  };
  const bearer = import.meta.env.VITE_SWEDBANK_BEARER;

  return fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;version=3.1",
      Authorization: `Bearer ${bearer}`,
      Host: "api.externalintegration.payex.com",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      console.log("Response Status: ", response.status);
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(`Nätverksfel - ${response.status}: ${text}`);
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response Data: ", data);
      return data as PaymentOrderIn;
    })
    .catch((error) => {
      console.error("Error in Cancel request: ", error);
      return null;
    });
}
