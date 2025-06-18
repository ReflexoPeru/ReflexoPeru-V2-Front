import { useState } from 'react';
import {
  getAppointmentsforTherapist,
  getPatientsByTherapist,
  getDailyCash,
  getAppointmentsBetweenDates,
} from '../service/reportsService';

export const useDailyTherapistReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async (date) => {
    setLoading(true);
    setError(null);
    try {
      // Formatear la fecha a YYYY-MM-DD
      const formattedDate = date.format('YYYY-MM-DD');
      const res = await getAppointmentsforTherapist(formattedDate);
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchReport };
};

export const usePatientsByTherapistReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const formattedDate = date.format('YYYY-MM-DD');
      const res = await getPatientsByTherapist(formattedDate);
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchReport };
};

export const useDailyCashReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const formattedDate = date.format('YYYY-MM-DD');
      const res = await getDailyCash(formattedDate);
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchReport };
};

export const useAppointmentsBetweenDatesReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAppointmentsBetweenDates(startDate, endDate);
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchReport };
};
