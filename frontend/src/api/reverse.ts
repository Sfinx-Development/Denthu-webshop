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

    console.log("Response Status: ", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Nätverksfel - ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as PaymentOrderIn;
    console.log("Response Data From reversal: ", data);
    // ev spara till DATABASEN?

    return data;
  } catch (error) {
    console.error("Error in reversal payment: ", error);
    return null;
  }
}
