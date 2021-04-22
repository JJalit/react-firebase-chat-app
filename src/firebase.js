import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyBNRjLtFOSeu6RZV67PnQmqvQQ9z7ykbJA",
  authDomain: "react-firebase-chat-app-f3683.firebaseapp.com",
  projectId: "react-firebase-chat-app-f3683",
  storageBucket: "react-firebase-chat-app-f3683.appspot.com",
  messagingSenderId: "177023407082",
  appId: "1:177023407082:web:34af173fed150fbb3d5893",
  measurementId: "G-J3VNR5012D",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//   firebase.analytics();
