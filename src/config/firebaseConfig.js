import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDVgHGJeCWdeB1rTmx4HAysRpPdQocf4nk",
    authDomain: "online-examination-porta-b5c46.firebaseapp.com",
    databaseURL: "https://online-examination-porta-b5c46-default-rtdb.firebaseio.com",
    projectId: "online-examination-porta-b5c46",
    storageBucket: "online-examination-porta-b5c46.appspot.com",
    messagingSenderId: "378339589030",
    appId: "1:378339589030:web:a1c5446664b398ed782d67",
    measurementId: "G-HQDNVFRS0R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const db = getFirestore(app);  
const rtdb = getDatabase(app); 

export { auth, database,rtdb };