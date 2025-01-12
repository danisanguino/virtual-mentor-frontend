import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider
  } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore";


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

    // Crear el primer hilo en la subcolección `threads`
    const threadsRef = collection(db, "users", userCredential.user.uid, "threads");
    const newThread = {
      title: "Primer Hilo",
      createdAt: new Date().toISOString(),
      messages: [
        { role: 'system', content: "Este es tu primer hilo de conversación." }
      ]
    };

    // Agregar el hilo a la subcolección `threads`
    await addDoc(threadsRef, newThread);

    return userCredential.user;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
};

//sign in user and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    console.log("Intentando iniciar sesión en Firebase...");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      throw new Error("Usuario no encontrado. Por favor, regístrate primero.");
    } else if (error.code === "auth/wrong-password") {
      throw new Error("Contraseña incorrecta. Intenta de nuevo.");
    } else if (error.code === "auth/invalid-credential") {
      throw new Error("Usuario no encontrado. Verifica que el mail y contraseña son correctos.");
    }
    throw new Error(`Error desconocido: ${error.message}`);
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