import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Order } from "../slices/orderSlice";
import { db } from "./config";
export const addOrderToDB = async (order: Order) => {
  try {
    const orderCollectionRef = collection(db, "orders");

    const docRef = await addDoc(orderCollectionRef, {});

    order.id = docRef.id;

    await updateDoc(docRef, order as Partial<Order>);

    const orderDoc = await getDoc(docRef);
    if (orderDoc.exists()) {
      const orderData = orderDoc.data();
      return orderData as Order;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error adding product: ", error);
    throw new Error("Failed to add product");
  }
};




export const editOrderInDB = async (order: Order) => {
  try {
    const orderCollectionRef = collection(db, "orders");

    const orderRef = doc(orderCollectionRef, order.id);

    const updatedOrderData = {
      ...order,
    };

    await updateDoc(orderRef, updatedOrderData);

    return order;
  } catch (error) {
    console.error("Error editing order: ", error);
    throw new Error("Failed to edit order");
  }
};

//   export const getProductsFromDB = async () => {
//     try {
//       const todoCollectionRef = collection(db, "products");

//       const q = query(todoCollectionRef);

//       const querySnapshot = await getDocs(q);

//       const products: Product[] = [];

//       querySnapshot.forEach((doc) => {
//         const todoData = doc.data();
//         products.push(todoData as Product);
//       });

//       return products;
//     } catch (error) {
//       console.error("Error getting products: ", error);
//       throw new Error("Failed to get products");
//     }
//   };

export const getAllOrdersFromDB = async () => {
  try {
    const orderCollectionRef = collection(db, "orders");
    const querySnapshot = await getDocs(orderCollectionRef);

    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      const orderData = doc.data() as Order;
      orders.push({ ...orderData, id: doc.id }); // Include the document ID
    });

    return orders;
  } catch (error) {
    console.error("Error getting orders: ", error);
    throw new Error("Failed to get orders");
  }
};


export const getOrderFromDB = async (userid: string) => {
  try {
    const orderCollectionRef = collection(db, "orders");

    const q = query(orderCollectionRef, where("user_id", "==", userid));

    const querySnapshot = await getDocs(q);
    const docSnapshot = querySnapshot.docs[0];
    return docSnapshot.data() as Order;
  } catch (error) {
    console.error("Error getting order: ", error);
    throw new Error("Failed to get order");
  }
};
