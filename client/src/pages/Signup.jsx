import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import OAuth from "../components/OAuth";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axiosConfig";
const Signup = () => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("api/auth/signup/", data);
            if (response.status == 201) navigate("/signin");
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    };
    return (
        <>
            <main className="flex flex-col items-center px-3  max-w-6xl w-full mx-auto my-3">
                <h1 className="text-2xl font-semibold my-7">Sign Up</h1>
                <form onSubmit={submit} className="flex relative flex-col  max-w-md w-full mx-auto gap-y-4">
                    <input required onChange={(e) => setData((prev) => ({ ...prev, userName: e.target.value }))} type="text" placeholder="User Name" className="border-gray-400 p-3 rounded-md" />
                    <input required type="email" onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" className="border-gray-400 p-3 rounded-md" />
                    <div className="relative">
                        <input required type={`${visible ? "text" : "password"}`} onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))} placeholder="password" className="border-gray-400 p-3 rounded-md w-full" />

                        <div onClick={() => setVisible(!visible)} className="cursor-pointer absolute top-4 right-4">
                            {visible ? <AiFillEye /> : <AiFillEyeInvisible />}
                        </div>
                    </div>
                    <button disabled={loading} className="font-normal w-full p-2 text-white rounded-md bg-slate-700 hover:bg-slate-800 active:bg-slate-900 transition ease-in-out disabled:bg-slate-600">
                        {loading ? "Creating Account" : "Sign Up"}
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
