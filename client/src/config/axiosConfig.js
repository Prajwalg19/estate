import axios from "axios";

const settings = axios.create({
    // baseURL: "/", // Use relative path
    withCredentials: true,
});

export default settings;
