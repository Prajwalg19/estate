import axios from "axios";

const settings = axios.create({
    baseURL: "http://localhost:4000",
});

export default settings;
