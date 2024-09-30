  import axios from 'axios';

  // Create a simple Axios instance with a base URL
  export const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // This allows sending cookies with requests
  });

  export const adminApi = axios.create({
      baseURL : 'http://localhost:5000/api/admin',
      withCredentials:true
  })  

