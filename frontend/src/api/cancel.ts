import { CancelRequestOutgoing, PaymentOrderIn } from "../../swedbankTypes";

interface PostCancelParams {
  transaction: CancelRequestOutgoing;
  cancelUrl: string;
}

export async function PostCancelToInternalApiDB({
  transaction,
  cancelUrl,
}: PostCancelParams) {
  const baseUrl =
    "https://swedbankpay-gad0dfg6fha9bpfh.swedencentral-01.azurewebsites.net/swedbankpay/cancelDenthu";

  const fullUrl = `${baseUrl}?cancelUrl=${encodeURIComponent(
    cancelUrl
  )}&customerId=denthuab`;

  try {
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;version=3.1",
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in cancel payment: ", error);
    return false;
  }
}
