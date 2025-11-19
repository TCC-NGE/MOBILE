import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { AsyncStorage } from '@react-native-async-storage/async-storage'
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAt_5JefPf0Zttsq_wY4WpyZ2Tgs7v4PDM",
  authDomain: "nge-transportes.firebaseapp.com",
  databaseURL: "https://nge-transportes-default-rtdb.firebaseio.com",
  projectId: "nge-transportes",
  storageBucket: "nge-transportes.firebasestorage.app",
  messagingSenderId: "159030382623",
  appId: "1:159030382623:web:b4e62d7dffe76d226e452a",
  measurementId: "G-9D3HSV5B0X"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
 export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
// export const auth = getAuth(app);