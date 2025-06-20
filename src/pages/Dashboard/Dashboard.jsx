import Style from './Dashboard.module.css';
import { img } from '../../utils/vars';
import { Avatar, Divider } from 'antd';
import MenuDashboard from './Menu/Menu';
import BtnLogOut from './ButtonLogOut/btnLogOut';
import { getLocalStorage } from '../../utils/localStorageUtility';
import { useSystemHook } from '../../features/configuration/cSystem/hook/systemHook';
import { useProfile } from '../../features/configuration/cProfile/hook/profileHook';
import { useAuth } from '../../routes/AuthContext';
import { useCompanyInfo } from '../../features/configuration/cSystem/hook/systemHook';
import { useUserPhoto } from '../../features/configuration/cProfile/hook/profileHook';

export default function Dashboard() {
  const { logoUrl } = useSystemHook();
  const { companyInfo } = useCompanyInfo();
  const { userRole } = useAuth();
  const { photoUrl } = useUserPhoto();

  const companyName = companyInfo?.company_name || getLocalStorage('company_name') || 'Empresa';
  
  const { profile, loading } = useProfile();
  const cachedFullName = getLocalStorage('user_full_name');
  const fullName = profile?.full_name || cachedFullName || 'Usuario';

  const role = userRole === 1 ? 'Administrador' : userRole === 2 ? 'Usuario' : 'Invitado';




  return (
    <div className={Style.dashboardContainer}>
      <div className={Style.dashboardHeader}>
        <img alt="Logo de reflexo" src={logoUrl || img} style={{
      width: '90px',
      height: '90px',
      borderRadius: '50%', 
      objectFit: 'cover',
      border: '2px solid #4CAF50', 
      backgroundColor: '#000', 
    }} />
        <p>{companyName}</p>
      </div>
      <Divider
        style={{
          marginBottom: '15px',
          marginTop: '15px',
          backgroundColor: '#333333',
        }}
      />
      <div className={Style.dashboardUser}>
        <Avatar alt="Logo de avatar" src={photoUrl || img} size={45} />
        <div className={Style.dashboardUserName}>
          <div>
            <h1>{loading ? cachedFullName : fullName}</h1>
          </div>
          <div>
            <p>{role}</p>
          </div>
        </div>
      </div>
      <Divider
        style={{
          marginBottom: '5px',
          marginTop: '15px',
          backgroundColor: '#333333',
        }}
      />
      <div className={Style.dashboardMenu}>
        <MenuDashboard />
      </div>
      <div className={Style.dashboardFooter}>
        <Divider style={{ backgroundColor: '#333333' }} />
        <BtnLogOut />
        <p>© 2025 Centro de Reflexoterapia </p>
      </div>
    </div>
  );
}
