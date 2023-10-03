import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyFmVcuiPf4zHiFL-C3Hj5RdIu1IOfOMc",
  authDomain: "cursoreact-1cc9a.firebaseapp.com",
  projectId: "cursoreact-1cc9a",
  storageBucket: "cursoreact-1cc9a.appspot.com",
  messagingSenderId: "796980234985",
  appId: "1:796980234985:web:499e0546f8c6a62b483e78",
  measurementId: "G-7HTCN5LMBN",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth };
