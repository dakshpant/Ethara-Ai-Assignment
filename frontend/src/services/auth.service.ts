import api from "./api";

export const loginUser = async (
  email: string,
  password: string,
) => {
  const response = await api.post(
    "/auth/login",
    {
      email,
      password,
    },
  );

  return response.data;
};

export const signupUser = async (
  data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  },
) => {
  const response = await api.post(
    "/auth/signup",
    data,
  );

  return response.data;
};

export const getUsers = async () => {
  const response = await api.get(
    "/auth/users",
  );

  return response.data.users;
};