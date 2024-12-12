import { PaymentOrderIn, ReverseRequestOutgoing } from "../../swedbankTypes";

interface PostCancelParams {
  transaction: ReverseRequestOutgoing;
  reverseUrl: string;
}

export async function PostReverseToInternalApiDB({
  transaction,
  reverseUrl,
}: PostCancelParams) {
  const baseUrl =
    "https://swedbankpay-gad0dfg6fha9bpfh.swedencentral-01.azurewebsites.net/swedbankpay/reverseDenthu";

  const fullUrl = `${baseUrl}?reverseUrl=${encodeURIComponent(
    reverseUrl
  )}&customerId=denthuab`;

  try {
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;version=3.1",
        // Lägg till Authorization-header om behövs
        // "Authorization": `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(transaction),
    });


    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in reversal payment: ", error);
    return false;
  }
}
