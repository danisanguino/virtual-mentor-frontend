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
      navigate("/app");
    } catch (error: any) {
      alert(error.message); 
   
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
    <div className='container-login'>

      <img src="" alt="" className='container-login__logo'/>

      <h1 className='container-login__title '>Bienvenido a tu asistente virtual</h1>
      
      <div className='container-login__form form-login'>
        
        {isRegister && (
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={handleChangeName}
            className="form-login__input"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleChangeEmail}
          className="form-login__input"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={handleChangePassword}
          className="form-login__input"
          required
        />

        <button onClick={handleAuth} className='button button--primary'>
          {isRegister ? "Registrar" : "Iniciar Sesión"}
        </button>

        <span onClick={() => setIsRegister(!isRegister)} className="interactive-text">
          {isRegister ? "¿Tienes cuenta? Inicia Sesión" : "¿No tienes cuenta? Regístrate"}
        </span>
      </div>

      <button onClick={handleGoogleSignIn} className='button button--google'>
        <img src="" alt="" />
        <p>Iniciar Sesión con Google</p>
      </button>
      
      <span className="container-login__terms">
        <input type="checkbox" required />
        <p>Acepto política privacidad. Leer</p>
      </span>

    </div>
)};

