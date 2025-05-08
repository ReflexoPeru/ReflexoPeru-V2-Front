import Style from './Dashboard.module.css';
import { name, img } from '../../utils/vars';
import { Avatar, Divider } from 'antd';
import MenuDashboard from './Menu/Menu';
import BtnLogOut from './ButtonLogOut/btnLogOut';

export default function Dashboard() {
  return (
    <div className={Style.dashboardContainer}>
      <div className={Style.dashboardHeader}>
        <img src={img} alt="Logo" />
        <p>{name}</p>
      </div>
      <Divider style={{ margin: 12 }} />
      <div className={Style.dashboardUser}>
        <Avatar src={img} size={45} style={{ marginLeft: 10 }} />
        <div className={Style.dashboardUserName}>
          <div>
            <h1>Luis Jeremy Villodas Almiron</h1>
          </div>
          <div>
            <p>Administrador</p>
          </div>
        </div>
      </div>
      <Divider style={{ margin: 12 }} />
      <div className={Style.dashboardMenu}>
        <MenuDashboard />
      </div>
      <div className={Style.dashboardFooter}>
        <Divider />
        <BtnLogOut />
        <p>© 2025 Centro de Reflexoterapia </p>
      </div>
    </div>
  );
}
