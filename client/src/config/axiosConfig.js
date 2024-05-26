import axios from "axios";

const settings = axios.create({
    baseURL: "https://findmyhome-two.vercel.app", // Use relative path
    withCredentials: true,
});

export default settings;
