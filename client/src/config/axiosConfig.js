import axios from "axios";

const settings = axios.create({
    baseURL: "https://estate-lake.vercel.app/",
    withCredentials: true,
});

export default settings;
