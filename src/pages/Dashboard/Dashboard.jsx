import Style from './Dashboard.module.css';
import { name, img } from '../../utils/vars';
import { Avatar, Divider } from 'antd';
import MenuDashboard from './Menu/Menu';
import BtnLogOut from './ButtonLogOut/btnLogOut';
import { getLocalStorage } from '../../utils/localStorageUtility';

export default function Dashboard() {
  const name = getLocalStorage('name');
  return (
    <div className={Style.dashboardContainer}>
      <div className={Style.dashboardHeader}>
        <img alt="Logo de reflexo" src={img} />
        <p>{name}</p>
      </div>
      <Divider
        style={{
          marginBottom: '15px',
          marginTop: '15px',
          backgroundColor: '#333333',
        }}
      />
      <div className={Style.dashboardUser}>
        <Avatar alt="Logo de avatar" src={img} size={45} />
        <div className={Style.dashboardUserName}>
          <div>
            <h1>{name}</h1>
          </div>
          <div>
            <p>Administrador</p>
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
