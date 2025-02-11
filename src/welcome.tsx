import React, { useState } from 'react'
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from './firebase/firebaseAuthentication';
import { Link, useNavigate } from 'react-router-dom';


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

  const acceptTerms = () => {
    const checkbox = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
    if (checkbox && checkbox.checked) {
      return true;
    } else {
      alert("Debes aceptar los términos y condiciones");
      return false;
    }
  }

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
      if (!acceptTerms()) return;
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
    if (!acceptTerms()) return;

    try {
      await signInWithGoogle();
    if (acceptTerms()) {
      navigate("/app")    }
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };
    


  return (

    <section className='container-welcome'>
      <div className='welcome'>
        <div className='container-login'>
          <img src="public/logo-virtualmentor-welcome.svg" alt="Logo Virtual Mentor" className='container-login__logo'/>
          <h1 className='container-login__title'>Bienvenido a tu asistente virtual</h1>
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

            <span onClick={() => setIsRegister(!isRegister)} className="form-login__interactive-text">
              {isRegister ? "¿Estás registrado? Inicia sesión aqui" : "¿No tienes cuenta? Regístrate"}
            </span>
          </div>

          <button onClick={handleGoogleSignIn} className='button button--google'>
            <img src="public/google-logo.svg" alt="Google" />
            <p>Iniciar Sesión con Google</p>
          </button>
          
          <div className="container-login__terms">
            <input type="checkbox" required />
             <p>Acepto política privacidad. <Link to="/legal" target='_blank'>Ver más</Link></p>
          </div>

        </div>
      </div>
    </section>
)};

