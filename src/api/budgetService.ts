import { ID, Query } from "react-native-appwrite";
import { databases } from "./appwrite";

const databaseId = process.env.EXPO_PUBLIC_DATABASE_ID!;
const collectionId = process.env.EXPO_PUBLIC_BUDGET_COLLECTION_ID!;

export async function getBudgets(accountId: string) {
  try {
    // In Appwrite, we need to query the documents in the collection
    // This is done to get the budgets for a specific user
    // not able to get the user database, need to make the separate collection for the user
    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("user", accountId),
    ]);
    return response.documents;
  } catch (error: any) {
    console.error("Get budgets error:", error);
    throw error;
  }
}

export async function addBudget(data: any) {
  try {
    const response = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      data,
    );
    return response;
  } catch (error: any) {
    console.error("Add budget error:", error);
    throw error;
  }
}

export async function updateBudget(documentId: string, data: any) {
  try {
    const response = await databases.updateDocument(
      databaseId,
      collectionId,
      documentId,
      data,
    );
    return response;
  } catch (error: any) {
    console.error("Update budget error:", error);
    throw error;
  }
}

export async function deleteBudget(documentId: string) {
  try {
    await databases.deleteDocument(databaseId, collectionId, documentId);
    return true;
  } catch (error: any) {
    console.error("Delete budget error:", error);
    throw error;
  }
}
