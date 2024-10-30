export interface PaymentOrderOutgoing {
  operation: string;
  currency: string;
  amount: number;
  vatAmount: number;
  description: string;
  userAgent: string;
  language: string;
  urls: {
    hostUrls: string[];
    paymentUrl: string;
    completeUrl: string;
    cancelUrl: string;
    callbackUrl: string;
    logoUrl: string;
  };
  payeeInfo: {
    payeeId: string;
    payeeReference: string;
    payeeName: string;
    orderReference: string;
  };
}

export interface PaymentOrderIncoming {
  id: string;
  operations: Operation[];
  paymentOrder: PaymentOrderIn;
}

export interface PaymentOrderId {
  id: string;
}

export interface PaymentOrderIn {
  id: string;
  amount: number;
  currency: string;
  description: string;
  created: string;
  updated: string;
  operation: string;
  status: string;
  payeeInfo: PaymentOrderId;
  payer: PaymentOrderId;
  urls: PaymentOrderId;
  aborted: PaymentOrderId;
  cancelled: PaymentOrderId;
  failed: PaymentOrderId;
  failedAttempts: PaymentOrderId;
  financialTransactions: PaymentOrderId;
  history: PaymentOrderId;
  metadata: PaymentOrderId;
  paid: PaymentOrderId;
  postPurchaseFailedAttempts: PaymentOrderId;
  reversed: PaymentOrderId;
  vatAmount: number;
  availableInstruments: string[];
  guestMode: boolean;
  implementation: string;
  initiatingSystemUserAgent: string;
  instrumentMode: boolean;
  integration: string;
  language: string;
}


//TYPER FÖR STATUSAR PÅ BETALNING, ABORTED, CANCELLED, FAILED:

//ABORTED
export interface PaymentAborted {
  id: string;
  abortReason: string;
}

//CANCELLED
export interface CancelledPaymentToken {
  type: string;
  token: string;
  name: string;
  expiryDate: string;
}

export interface CancelledPaymentDetails {
  nonPaymentToken: string;
  externalNonPaymentToken: string;
}

export interface PaymentCancelled {
  id: string;
  cancelReason: string;
  instrument: string;
  number: number;
  payeeReference: string;
  orderReference: string;
  transactionType: string;
  amount: number;
  submittedAmount: number;
  feeAmount: number;
  discountAmount: number;
  tokens: CancelledPaymentToken[];
  details: CancelledPaymentDetails;
}

//FAILED
export interface FailedPaymentProblemDetails {
  name: string;
  description: string;
}
export interface FailedPaymentProblem {
  type: string;
  title: string;
  status: number;
  detail: string;
  problems: FailedPaymentProblemDetails[];
}
export interface PaymentFailed {
  id: string;
  problem: FailedPaymentProblem;
}

export enum OrderItemType {
  PRODUCT = "PRODUCT",
  OTHER = "OTHER",
}

// export interface TransationOrderItem {
//   reference: string;
//   name: string;
//   type: OrderItemType;
//   class: string;
//   itemUrl?: string;
//   imageUrl?: string;
//   description?: string;
//   discountDescription?: string;
//   quantity: number;
//   quantityUnit: string;
//   unitPrice: number;
//   discountPrice?: number;
//   vatPercent: number;
//   amount: number;
//   vatAmount: number;
// }

//CAPTURE:

export interface Transaction {
  description: string;
  amount: number;
  vatAmount: number;
  payeeReference: string;
  captureUrl: string;
}

export interface OutgoingTransaction {
  transaction: Transaction;
  // orderItems: TransationOrderItem[];
}

export interface OutgoingTransactionNoUrl {
  description: string;
  amount: number;
  vatAmount: number;
  payeeReference: string;
}

export interface PaymentOrderResponse {
  paymentOrder: {
    id: string;
    created: string;
    updated: string;
    operation: string;
    status: string;
    currency: string;
    amount: number;
    vatAmount: number;
    remainingCaptureAmount?: number; // Optional om det bara finns efter en delcapture
    remainingCancellationAmount?: number; // Optional om det bara finns efter en delcapture
    remainingReversalAmount: number;
    description: string;
    initiatingSystemUserAgent: string;
    language: string;
    availableInstruments: string[];
    implementation: string;
    integration: string;
    instrumentMode: boolean;
    guestMode: boolean;
    orderItems: {
      id: string;
    };
    urls: {
      id: string;
    };
    payeeInfo: {
      id: string;
    };
    payer: {
      id: string;
    };
    history: {
      id: string;
    };
    failed: {
      id: string;
    };
    aborted: {
      id: string;
    };
    paid: {
      id: string;
    };
    cancelled: {
      id: string;
    };
    financialTransactions: {
      id: string;
    };
    failedAttempts: {
      id: string;
    };
    postPurchaseFailedAttempts: {
      id: string;
    };
    metadata: {
      id: string;
    };
  };
  operations: Operation[];
}

export interface Operation {
  href: string;
  rel: string;
  method: string;
  contentType: string;
}

export interface Paid {
  id: string;
  number: number;
  instrument: string;
  payeeReference: string;
  transactionType: string;
  amount: number;
  submittedAmount: number;
  feeAmount: number;
  discountAmount: number;
  paymentTokenGenerated: boolean;
  details: {
    externalNonPaymentToken: string;
    cardBrand: string;
    cardType: string;
    maskedPan: string;
    expiryDate: string;
    issuerAuthorizationApprovalCode: string;
    acquirerTransactionType: string;
    acquirerStan: string;
    acquirerTerminalId: string;
    acquirerTransactionTime: string; // ISO 8601 timestamp
    transactionInitiator: string;
    bin: string;
    paymentAccountReference: string;
  };
}

export interface ValidPayment {
  id: string;
  created: string; 
  updated: string;
  operation: string;
  status: string;
  currency: string; 
  amount: number;
  vatAmount: number;
  remainingCaptureAmount: number;
  remainingCancellationAmount: number;
  description: string;
  initiatingSystemUserAgent: string;
  language: string;
  availableInstruments: string[]; 
  implementation: string;
  integration: string;
  instrumentMode: boolean;
  guestMode: boolean;
  orderItems: {
    id: string;
  };
  urls: {
    id: string;
  };
  payeeInfo: {
    id: string;
  };
  payer: {
    id: string;
  };
  history: {
    id: string;
  };
  failed: {
    id: string;
  };
  aborted: {
    id: string;
  };
  paid: Paid;
  cancelled: {
    id: string;
    paymentTokenGenerated: boolean;
  };
  reversed: {
    id: string;
    paymentTokenGenerated: boolean;
  };
  financialTransactions: {
    id: string;
  };
  failedAttempts: {
    id: string;
  };
  postPurchaseFailedAttempts: {
    id: string;
  };
  metadata: {
    id: string;
  };
}

export interface ValidPaymentOrder {
  paymentOrder: ValidPayment;
  operations: Operation[];
}

export interface CaptureResponse {
  payment: string;
  capture: Capture;
}

export interface Capture {
  id: string;
  transaction: CaptureResponseTransaction;
}

export interface CaptureResponseTransaction {
  id: string;
  created: string; 
  updated: string; 
  type: string;
  state: string;
  number: number;
  amount: number;
  vatAmount: number;
  description: string;
  payeeReference: string;
  isOperational: boolean;
  operations: Array<any>;
}

// // CaptureResponse type in TypeScript
// export interface CaptureResponse {
//   paymentOrder: {
//     id: string;
//     created: string;
//     updated: string;
//     operation: string;
//     status: string;
//     currency: string;
//     amount: number;
//     vatAmount: number;
//     remainingCaptureAmount?: number; // Optional field, only present after a partial capture
//     remainingCancellationAmount?: number; // Optional field, only present after a partial capture
//     remainingReversalAmount: number;
//     description: string;
//     initiatingSystemUserAgent: string;
//     language: string;
//     availableInstruments: string[];
//     implementation: string;
//     integration: string;
//     instrumentMode: boolean;
//     guestMode: boolean;
//     orderItems: { id: string };
//     urls: { id: string };
//     payeeInfo: { id: string };
//     payer: { id: string };
//     history: { id: string };
//     failed: { id: string };
//     aborted: { id: string };
//     paid: { id: string };
//     cancelled: { id: string };
//     financialTransactions: { id: string };
//     failedAttempts: { id: string };
//     postPurchaseFailedAttempts: { id: string };
//     metadata: { id: string };
//   };
//   operations: CaptureOperation[];
// }

// type CaptureOperation = {
//   href: string;
//   rel: string;
//   method: string;
//   contentType: string;
// };

export interface CallbackData {
  orderReference: string;
  paymentOrder: CallbackPaymentOrder;
}

interface CallbackPaymentOrder {
  id: string;
  instrument: string;
  number?: number;
}

// CANCEL REQUEST
export interface CancelRequestOutgoing {
  description: string;
  payeeReference: string;
}

// REVERSE REQUEST
export interface ReverseRequestOutgoing {
  description: string;
  amount: number;
  vatAmount: number;
  payeeReference: string;
}
