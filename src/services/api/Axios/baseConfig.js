import axios from 'axios';

const BaseURL = 'http://127.0.0.1:8000/api/';
const token = localStorage.getItem('token');

const instance = axios.create({
  baseURL: BaseURL,
});

instance.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return console.log('Algo fallooo : ' + error);
  },
);

export default instance;
