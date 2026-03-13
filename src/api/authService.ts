import { ID, Query } from "react-native-appwrite";
import { account, databases } from "./appwrite";

const databaseId = process.env.EXPO_PUBLIC_DATABASE_ID!;
const usersCollectionId = process.env.EXPO_PUBLIC_USER_COLLECTION_ID!;

// Sign Up with Email & Password
export async function signUp(email: string, password: string, name: string) {
  try {
    // Appwrite** Create user account
    const newAccount = await account.create(ID.unique(), email, password, name);

    //Appwrite** Create new collection in the database for the user
    if (newAccount) {
      await databases.createDocument(
        databaseId,
        usersCollectionId,
        ID.unique(),
        {
          accountId: newAccount.$id,
          email,
          password,
          name,
        },
      );
      // Automatically sign in after registration
      return await signIn(email, password);
    }
    return newAccount;
  } catch (error: any) {
    console.error("Sign up error:", error);
    throw error;
  }
}

// Sign In with Email & Password
export async function signIn(email: string, password: string) {
  try {
    // Create email session
    const session = await account.createEmailPasswordSession(email, password);
    return await getCurrentUser();
  } catch (error: any) {
    console.error("Sign in error:", error);
    throw error;
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("No user found");

    return currentAccount;
  } catch (error: any) {
    console.error("Get user error:", error);
    return null;
  }
}

// Get Current User Profile
export async function getCurrentUserProfile(userId: string) {
  try {
    const response = await databases.listDocuments(
      databaseId,
      usersCollectionId,
      [Query.equal("accountId", userId)],
    );

    if (response.documents.length === 0) {
      throw new Error("User document not found in database.");
    }

    const documentId = response.documents[0].$id;
    const currentAccount = await databases.getDocument(
      databaseId,
      usersCollectionId,
      documentId,
    );
    if (!currentAccount) throw new Error("No user found");

    const currentUserAccountWithOutPassword = {
      ...currentAccount,
      password: "[PASSWORD]",
    };

    return currentUserAccountWithOutPassword;
  } catch (error: any) {
    console.error("Get user error:", error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    // Delete current session
    await account.deleteSession("current");
    return true;
  } catch (error: any) {
    console.error("Sign out error:", error);
    throw error;
  }
}

// Update User Profile
export async function updateProfile(userId: string, data: any) {
  try {
    // First, find the document ID associated with this accountId
    // This is done because the user document is not stored in the same collection as the user account
    const response = await databases.listDocuments(
      databaseId,
      usersCollectionId,
      [Query.equal("accountId", userId)],
    );

    if (response.documents.length === 0) {
      throw new Error("User document not found in database.");
    }

    const documentId = response.documents[0].$id;

    // Now update the document using its actual ID
    const updatedUser = await databases.updateDocument(
      databaseId,
      usersCollectionId,
      documentId,
      data,
    );
    return updatedUser;
  } catch (error: any) {
    console.error("Update profile error:", error);
    throw error;
  }
}
