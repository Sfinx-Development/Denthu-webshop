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
import { Product } from "../slices/productSlice";
import { db } from "./config";


export const getProductsByCategoryFromDB = async (categoryId: string): Promise<Product[]> => {
  if (!categoryId) {
    throw new Error("Category ID is undefined or empty.");
  }

  try {
    const q = query(
      collection(db, "products"),
      where("categoryId", "==", categoryId) // Filtrering sker här
    );
    const querySnapshot = await getDocs(q);
    const fetchedProducts: Product[] = [];
    querySnapshot.forEach((doc) => {
      fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
    });
    return fetchedProducts; // Returnerar endast produkter för den specifika kategorin
  } catch (error) {
    console.error("Error fetching products by category: ", error);
    throw new Error("Failed to fetch products by category");
  }
};




export const addProductToDB = async (product: Product) => {
  try {
    const todoCollectionRef = collection(db, "products");

    // Ensure launch_date is set to the current date
    product.launch_date = new Date().toISOString();

    const docRef = await addDoc(todoCollectionRef, product);

    product.id = docRef.id;
    await updateDoc(docRef, { id: product.id });

    const todoDoc = await getDoc(docRef);
    if (todoDoc.exists()) {
      const todoData = todoDoc.data();
      return todoData as Product;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error adding product: ", error);
    throw new Error("Failed to add product");
  }
};

export const editProductInDB = async (product: Product) => {
  try {
    const productCollectionRef = collection(db, "products");
    const productRef = doc(productCollectionRef, product.id);
    const updatedProductData = {
      ...product,
      launch_date: new Date(product.launch_date).toISOString(),
    };

    await updateDoc(productRef, updatedProductData);

    return product;
  } catch (error) {
    console.error("Error editing product: ", error);
    throw new Error("Failed to edit product");
  }
};

export const getProductsFromDB = async () => {
  try {
    const todoCollectionRef = collection(db, "products");
    const q = query(todoCollectionRef);

    const querySnapshot = await getDocs(q);

    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      const todoData = doc.data();
      if (todoData.launch_date instanceof Date) {
        todoData.launch_date = todoData.launch_date.toISOString();
      }
      products.push(todoData as Product);
    });

    return products;
  } catch (error) {
    console.error("Error getting products: ", error);
    throw new Error("Failed to get products");
  }
};

export const getProductFromDBById = async (id: string) => {
  try {
    const todoCollectionRef = collection(db, "products");
    const q = query(todoCollectionRef, where("id", "==", id));

    const querySnapshot = await getDocs(q);
    const docSnapshot = querySnapshot.docs[0];

    if (docSnapshot.exists()) {
      const docData = docSnapshot.data();
      if (docData.launch_date instanceof Date) {
        docData.launch_date = docData.launch_date.toISOString();
      }
      return docData as Product;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting product: ", error);
    throw new Error("Failed to get product");
  }
};
