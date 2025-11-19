import { auth, db } from '../src/config/firebaseConfig';
import { signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function firebaseHealthCheck() {
  try {
    const userCred = await signInAnonymously(auth);
    const ref = doc(db, 'healthCheck', userCred.user.uid);
    await setDoc(ref, { ok: true, ts: Date.now() });
    const snap = await getDoc(ref);
    console.log('✅ Firebase conectado com sucesso!');
    console.log('UID:', userCred.user.uid);
    console.log('Firestore Test:', snap.exists() && snap.data().ok === true);
  } catch (error)   {
    console.error('❌ Erro de conexão com Firebase:', error);
  }
}
