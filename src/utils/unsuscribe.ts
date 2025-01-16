import { onAuthStateChanged, Auth } from "firebase/auth"; // Importamos el tipo Auth
import { fetchUserData } from "./firestore";
import { IThread } from "../interfaces/interfaces";

export const unsubscribe = (
  auth: Auth, 
  setUserName: React.Dispatch<React.SetStateAction<string | null>>, 
  setThreads: React.Dispatch<React.SetStateAction<IThread[]>> 
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      setUserName(user.displayName || "Usuario");
      try {
        await fetchUserData(setUserName, setThreads);
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    } else {
      console.log("No hay usuario autenticado.");
      setUserName(null);
      setThreads([]); 
    }
  });
};