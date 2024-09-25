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
import { Product, ProductWithDate } from "../slices/productSlice";
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
    const productWithDate: ProductWithDate = {
      ...product,
      // launch_date: new Date(product.launch_date),
    };

    const docRef = await addDoc(todoCollectionRef, productWithDate);

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

    const productWithDate: ProductWithDate = {
      ...product,
      // launch_date: new Date(product.launch_date),
    };

    const updatedProductData = {
      ...productWithDate,
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
      const docData = doc.data() as Product;
      // docData.launch_date = docData.launch_date.toString();
      products.push(docData as Product);
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
      const docData = docSnapshot.data() as Product;
      // docData.launch_date = docData.launch_date.toString();
      return docData as Product;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting product: ", error);
    throw new Error("Failed to get product");
  }
};
