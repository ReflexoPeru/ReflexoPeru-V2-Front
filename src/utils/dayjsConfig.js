// ================================================== //
// CONFIGURACIÓN GLOBAL DE DAYJS PARA ANT DESIGN    //
// ================================================== //

import dayjs from 'dayjs';
import 'dayjs/locale/es';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';

// Configurar plugins
dayjs.extend(weekOfYear);
dayjs.extend(weekday);

// Configurar locale global en español
dayjs.locale('es');

// Configurar que la semana empiece el lunes (1) en lugar del domingo (0)
dayjs.Ls.es.weekStart = 1;

// Exportar dayjs configurado
export default dayjs;
