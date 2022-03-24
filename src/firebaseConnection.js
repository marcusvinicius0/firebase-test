import firebase from "firebase/app";
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyASDjCZRw2G9HJk2Mh5TUAa98iFwV__XYg",
    authDomain: "cursofirebase-e8573.firebaseapp.com",
    projectId: "cursofirebase-e8573",
    storageBucket: "cursofirebase-e8573.appspot.com",
    messagingSenderId: "372463752321",
    appId: "1:372463752321:web:451e11ecb3b6482380e980",
    measurementId: "G-J2T1CCYJ8R"
  };

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase
