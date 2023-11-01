import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import OAuth from "../components/OAuth";
import { Link } from "react-router-dom";
import axios from "axios";
const Signup = () => {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});
    const submit = async () => {
        let ent = Object.entries(data).some((entry) => {
            return entry.length != 0 ? true : false;
        });

        if (ent != true) return;
        try {
            const response = await axios.post("http://localhost:4000/api/auth/signup/", data);
            console.log(response.data);
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <>
            <main className="flex flex-col items-center px-3  max-w-6xl w-full mx-auto my-3">
                <h1 className="text-2xl font-semibold my-7">Sign Up</h1>
                <form className="flex relative flex-col  max-w-md w-full mx-auto gap-y-4">
                    <input onChange={(e) => setData((prev) => ({ ...prev, userName: e.target.value }))} type="text" placeholder="User Name" className="border-gray-400 p-3 rounded-md" />
                    <input type="email" onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" className="border-gray-400 p-3 rounded-md" />
                    <div className="relative">
                        <input type={`${visible ? "text" : "password"}`} onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))} placeholder="password" className="border-gray-400 p-3 rounded-md w-full" />

                        <div onClick={() => setVisible(!visible)} className="cursor-pointer absolute top-4 right-4">
                            {visible ? <AiFillEye /> : <AiFillEyeInvisible />}
                        </div>
                    </div>
                    <button type="button" onClick={submit} className="font-normal w-full p-2 text-white rounded-md bg-slate-700 hover:bg-slate-800 active:bg-slate-900 transition ease-in-out">
                        Sign Up
                    </button>
                    <OAuth />
                    <span className="text-sm font-medium relative left-0">
                        Already Have An Account ?{" "}
                        <Link className="text-blue-600 " to="/signin">
                            Login
                        </Link>
                    </span>
                </form>
            </main>
        </>
    );
};

export default Signup;
