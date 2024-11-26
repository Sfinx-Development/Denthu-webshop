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
    console.log("URL: ", fullUrl, " DATA: ", transaction);
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
      // const errorText = await response.text();
      // throw new Error(`Nätverksfel - ${response.status}: ${errorText}`);
      return false;
    }

    // const data = (await response.json()) as PaymentOrderIn;
    // console.log("Response Data From cancellation: ", data);
    // // ev spara till DATABASEN?

    return true;
  } catch (error) {
    console.error("Error in cancel payment: ", error);
    return false;
  }
}
