import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://www.wecasa.fr/api/techtest',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
