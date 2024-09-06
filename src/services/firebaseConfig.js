/* eslint-disable no-undef */
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: "AIzaSyA7pjqqd9M9jXIiepDb4pKgkLanhGjwSM4",
	authDomain: "https://site-kong.netlify.app",
	projectId: "site-kong",
	storageBucket: "site-kong.appspot.com",
	messagingSenderId: "291491939183",
	appId: "1:291491939183:web:6e8c5a71e7731e37271e9a"
};

// eslint-disable-next-line no-undef
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Configura a persistência
export default app;
