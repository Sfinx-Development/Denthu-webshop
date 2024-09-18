import { collection, getDocs, query, where } from "firebase/firestore";
import { CallbackData } from "../../swedbankTypes";
import { db } from "./config";

export const getCallbackFromDb = async (orderReference: string) => {
  try {
    const callbackCollectionRef = collection(db, "callbacks");

    const q = query(
      callbackCollectionRef,
      where("orderReference", "==", orderReference)
    );

    const querySnapshot = await getDocs(q);
    const docSnapshot = querySnapshot.docs[0];
    return docSnapshot.data() as CallbackData;
  } catch (error) {
    console.error("Error getting Callback: ", error);
    throw new Error("Failed to get Callback");
  }
};
