import axios from "axios";

const settings = axios.create({
    baseURL: "/api", // Use relative path
    withCredentials: true,
});

export default settings;
