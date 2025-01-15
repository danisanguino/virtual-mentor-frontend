import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';

export const handleLogOut = async (navigate: ReturnType<typeof useNavigate>) => {
  try {
    await signOut(auth); 
    navigate("/"); 
  } catch (error) {
    console.error("Error al cerrar sesión: ", error);
  }
};

