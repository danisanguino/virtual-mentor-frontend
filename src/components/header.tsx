import { useNavigate } from 'react-router-dom';
import { HeaderProps } from '../interfaces/interfaces';
import { handleLogOut } from '../utils/auth';
import { greeting } from '../utils/greeting';

export const Header: React.FC<HeaderProps>  = ({ userName }) => {

  const navigate = useNavigate();

  return (
    <div className='header'>
      
      <img src="" alt="Virtual Mentor logo" className='header__logo' />

      <div className='header__container'>
        <a className='header__container--text'>{greeting(new Date().getHours())} {userName}, ¿en qué puedo ayudarte hoy?</a>
        <button onClick={() => handleLogOut(navigate)} className='header__container--button'>Cerrar Sesión</button>
      </div>
    </div>
  )
}
