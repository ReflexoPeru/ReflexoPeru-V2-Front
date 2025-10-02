import { get } from '../../../services/api/Axios/MethodsGeneral';

export const getAppointmentsforTherapist = async (date) => {
  try {
    const res = await get(`report/appointmentsForTherapist?date=${date}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getPatientsByTherapist = async (date) => {
  try {
    const res = await get(`report/patientsByTherapist?date=${date}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getDailyCash = async (date) => {
  try {
    const res = await get(`report/dailyCash?date=${date}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAppointmentsBetweenDates = async (startDate, endDate) => {
  try {
    const res = await get(
      `report/appointmentsBetweenDates?startDate=${startDate}&endDate=${endDate}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
