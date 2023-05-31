import { openDB } from "idb";

const DB_NAME = "jate";
const DB_VERSION = 1;
const OBJECT_STORE_NAME = "jate";

const initdb = async () => {
  try {
    const jateDb = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
          console.log("jate database already exists");
          return;
        }
        db.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id", autoIncrement: true });
        console.log("jate database created");
      },
    });
    return jateDb;
  } catch (error) {
    console.error("Failed to initialize the database:", error);
    throw error;
  }
};

// Takes content and adds it to the IndexedDB database using idb.
export const putDb = async (content) => {
  try {
    console.log("PUT to the database");
    const jateDb = await openDB(DB_NAME, DB_VERSION);
    const tx = jateDb.transaction(OBJECT_STORE_NAME, "readwrite");
    const store = tx.objectStore(OBJECT_STORE_NAME);
    const request = store.put({ value: content });
    const result = await request;
    console.log("🚀 - Data saved to the database", result.value);
  } catch (error) {
    console.error("Failed to put data into the database:", error);
    throw error;
  }
};

// Gets content from the IndexedDB database using idb.
export const getDb = async () => {
  try {
    console.log("GET from the database");
    const jateDb = await openDB(DB_NAME, DB_VERSION);
    const tx = jateDb.transaction(OBJECT_STORE_NAME, "readonly");
    const store = tx.objectStore(OBJECT_STORE_NAME);
    const request = store.get(1);
    const result = await request;
    if (result) {
      console.log("🚀 - Data retrieved from the database", result.value);
      return result.value;
    } else {
      console.log("🚀 - Data not found in the database");
      return null;
    }
  } catch (error) {
    console.error("Failed to get data from the database:", error);
    throw error;
  }
};

// Initialize the database
initdb();
