// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhIB4PNp72Xwkmfap65a46d2xSfSxce2Y",
  authDomain: "traveldiary-ce5e6.firebaseapp.com",
  projectId: "traveldiary-ce5e6",
  storageBucket: "traveldiary-ce5e6.appspot.com",
  messagingSenderId: "866912837476",
  appId: "1:866912837476:web:d2ee330c8a1a53d3e8e471"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export {auth}