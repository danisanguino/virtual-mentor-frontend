import React, { useState } from 'react'
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from './firebase/firebaseAuthentication';
import { useNavigate } from 'react-router-dom';


export const Welcome = () => {
  const [isRegister, setIsRegister] = useState<Boolean>(true);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  };
  
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const validateEmail = (email: string) => {
    return email.includes("@") && email.includes(".");
  };

  const validateFields = () => {
    if (!email || !password) {
      alert("Correo y contraseña son obligatorios");
      return false;
    }
  
    if (!validateEmail(email)) {
      alert("Por favor, ingresa un correo electrónico válido");
      return false;
    }
  
    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
  
    if (isRegister && !name) {
      alert("El nombre es obligatorio");
      return false;
    }
  
    return true;
  };

  const handleAuth = async () => {
    try {
      if (!validateFields()) return;
  
      if (isRegister) {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
  
      console.log("Inicio de sesión exitoso. Redirigiendo...");
      navigate("/app");
    } catch (error: any) {
      alert(error.message); // Muestra el error al usuario
      // Opcional: Elimina el log del error si no es necesario
      console.error("Error en handleAuth:", error.message);
    } finally {
      setPassword("");
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/app");
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };
    


  return (
    <>
      <h1>Bienvenido al asistente Virtual Mentor</h1>
      
      <div>
        {isRegister && (
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={handleChangeName}
            required
          />
        )}

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={handleChangeEmail}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={handleChangePassword}
          required
        />

        <button onClick={handleAuth}>
          {isRegister ? "Registrar" : "Iniciar Sesión"}
        </button>

        {/* Cambiar entre registro e inicio de sesión */}
        <button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "¿Tienes cuenta? Inicia Sesión" : "¿No tienes cuenta? Regístrate"}
        </button>

        <button onClick={handleGoogleSignIn}>
          Iniciar Sesión con Google
        </button>
      </div>
    </>
)};

