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
 
import {Category} from "../slices/categorySlice"


  import { db } from "./config";
  export const addCategoryToDB = async (category: Category) => {
    try {
      const todoCollectionRef = collection(db, "categorys");
  
      const docRef = await addDoc(todoCollectionRef, {});
  
     category.id = docRef.id;
  
      await updateDoc(docRef, category as Partial<Category>);
  
      const todoDoc = await getDoc(docRef);
      if (todoDoc.exists()) {
        const todoData = todoDoc.data();
        return todoData as Category;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error adding category: ", error);
      throw new Error("Failed to add category");
    }
  };
  
  export const editCategoryInDB = async (category: Category) => {
    try {
      const categoryCollectionRef = collection(db, "categorys");
  
      const categoryRef = doc(categoryCollectionRef, category.id);
  
      const updatedCategoryData = {
        ...category,
        sizes: category.sizes,
      };
  
      await updateDoc(categoryRef, updatedCategoryData);
  
      return category;
    } catch (error) {
      console.error("Error editing category: ", error);
      throw new Error("Failed to edit category");
    }
  };
  
  export const getCategorysFromDB = async () => {
    try {
      const todoCollectionRef = collection(db, "categorys");
  
      const q = query(todoCollectionRef);
  
      const querySnapshot = await getDocs(q);
  
      const categorys: Category[] = [];
  
      querySnapshot.forEach((doc) => {
        const todoData = doc.data();
        categorys.push(todoData as Category);
      });
  
      return categorys;
    } catch (error) {
      console.error("Error getting categorys: ", error);
      throw new Error("Failed to get categorys");
    }
  };
  
  export const getCategoryFromDB = async (id: string) => {
    try {
      const todoCollectionRef = collection(db, "categorys");
  
      const q = query(todoCollectionRef, where("id", "==", id));
  
      const querySnapshot = await getDocs(q);
      const docSnapshot = querySnapshot.docs[0];
      return docSnapshot.data() as Category;
    } catch (error) {
      console.error("Error getting categorys: ", error);
      throw new Error("Failed to get categorys");
    }
  };
  