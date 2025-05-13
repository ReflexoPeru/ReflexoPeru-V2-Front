import { Outlet } from 'react-router';
import CustomLayout from '../components/Header/CustomLayout';
import Dashboard from './Dashboard/Dashboard';
import Style from './View.module.css';

export default function View() {
  return (
    <div className={Style.Container}>
      <div className={Style.SideBar}>
        <Dashboard />
      </div>
      <div className={Style.Content}>
        <div className={Style.Header}>
          <CustomLayout />
        </div>
        <div className={Style.Outlet}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
