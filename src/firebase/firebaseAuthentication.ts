import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider
  } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";


//login user and password
export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Guardar datos del usuario en Firestore
    const userRef = doc(db, "users", userCredential.user.uid);
    await setDoc(userRef, {
      email,
      name,
      createdAt: new Date().toISOString(),
    });

    return userCredential.user;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
};

//sign in user and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Verificar si el usuario tiene un documento en Firestore
    const userRef = doc(db, "users", userCredential.user.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      throw new Error("Usuario no registrado en la base de datos.");
    }

    return userCredential.user;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

//login with google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    // save new user in firestore 
    const userRef = doc(db, "users", userCredential.user.uid);
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        email: userCredential.user.email,
        name: userCredential.user.displayName,
        createdAt: new Date(),
      });
    }

    return userCredential.user;
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    throw error;
  }
};