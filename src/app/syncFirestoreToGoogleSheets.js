import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbyMEpm0aa5qR15AdtY818gk5HqsBa48c4W7S34lqKP1QCuIrdcSwN5vJLuRZfX9MR2r/exec"; 


async function syncFirestoreToGoogleSheets() {
  try {
    const querySnapshot = await getDocs(collection(db, "info"));
    const data = querySnapshot.docs.map((doc) => doc.data());

    const response = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to send data to Google Sheets: ${response.statusText} - ${errorText}`
      );
    }

    console.log("Data successfully sent to Google Sheets");
  } catch (error) {
    console.error("Error syncing data:", error);
  }
}


export default syncFirestoreToGoogleSheets;