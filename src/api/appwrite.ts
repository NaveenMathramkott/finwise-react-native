import { Account, Avatars, Client, Databases } from "react-native-appwrite";

export const config = {
  endpoint: "https://fra.cloud.appwrite.io/v1", // Replace with your endpoint
  projectId: "69a9af92003cee538499", // Replace with your project ID
  // platform: "com.yourcompany.yourapp", // Replace with your bundle ID/package name
};

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

// Initialize services
export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
