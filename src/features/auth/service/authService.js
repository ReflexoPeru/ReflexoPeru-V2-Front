import { post, put } from '../../../services/api/Axios/MethodsGeneral';

export const login = async (data) => {
  const response = await post('login', data);
  return response;
};

export const validateCode = async (code, id) => {
  const response = await post(`verification/${id}`, code);
  return response;
};

export const changePassword = async (data) => {
  const response = await put(`change_password`, data);
  console.log(response);
  return response;
};
export const logOut = async () => {
  //Funcion de logOut
};
