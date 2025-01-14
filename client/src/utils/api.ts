  import axios from 'axios';

  // Create a simple Axios instance with a base URL
  export const api = axios.create({
    baseURL: process.env.API_BASE_URL,
    withCredentials: true, // This allows sending cookies with requests
  });

  export const adminApi = axios.create({
      baseURL : `${process.env.API_BASE_URL}/admin`,
      withCredentials:true
  })  

