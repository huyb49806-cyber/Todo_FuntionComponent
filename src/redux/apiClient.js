import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

export const endpoints = {
  todos: '/todos',
  login: '/login',
  checkAuth: '/check-auth',
  logout: '/logout',
  users: '/users',
  register: '/register',
};
