import Style from './btnLogOut.module.css';
import { useAuth } from '../../../features/auth/hook/authHook';
export default function BtnLogOut() {
  const { logOut } = useAuth();
  return (
    <>
      <button onClick={logOut} className={Style.btnLogOut}>
        Cerrar sesión
      </button>
    </>
  );
}
