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

// GET: Verifiera reverseringsstatus
export async function GetReversedStatus(reversedUrl: string): Promise<PaymentOrderIn | null> {
  try {
    const response = await fetch(reversedUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;version=3.1",
        // Lägg till Authorization-header om behövs
        // "Authorization": `Bearer ${bearerToken}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to verify reversal status, status:", response.status);
      return null;
    }

    const data = await response.json();
    return data as PaymentOrderIn;
  } catch (error) {
    console.error("Error in verifying reversal status: ", error);
    return null;
  }
}
