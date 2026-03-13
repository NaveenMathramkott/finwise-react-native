import { databases } from "./appwrite";

const databaseId = process.env.EXPO_PUBLIC_DATABASE_ID!;
const collectionId = process.env.EXPO_PUBLIC_CATEGORY_COLLECTION_ID!;

// Adding the category from the backend (NO screen for adding the category in the mobile application)
export async function getCategories() {
  try {
    const response = await databases.listDocuments(databaseId, collectionId);
    return response.documents;
  } catch (error: any) {
    console.error("Get categories error:", error);
    throw error;
  }
}
