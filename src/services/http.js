import axios from 'axios';
import { API_ROOT } from '../configs';

export const instance = axios.create({
  baseURL: API_ROOT,
});