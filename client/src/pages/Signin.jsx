import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import OAuth from "../components/OAuth";
import { Link } from "react-router-dom";
const SignIn = () => {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <main className="flex flex-col items-center px-3  max-w-6xl w-full mx-auto my-3">
                <h1 className="text-2xl font-semibold my-7">Sign In</h1>
                <form className="flex relative flex-col  max-w-md w-full mx-auto gap-y-4">
                    <input type="email" placeholder="Email" className="border-gray-400 p-3 rounded-md" />
                    <div className="relative">
                        <input type={`${visible ? "text" : "password"}`} placeholder="password" className="border-gray-400 p-3 rounded-md w-full" />

                        <div onClick={() => setVisible(!visible)} className="cursor-pointer absolute top-4 right-4">
                            {visible ? <AiFillEye /> : <AiFillEyeInvisible />}
                        </div>
                    </div>
                    <button type="button" className="font-normal w-full p-2 text-white rounded-md bg-slate-700 hover:bg-slate-800 active:bg-slate-900 transition ease-in-out">
                        Sign In
                    </button>
                    <OAuth />
                    <span className="text-sm font-medium relative left-0">
                        Don&#39;t Have An Account ?{" "}
                        <Link className="text-blue-600 " to="/signup">
                            Register
                        </Link>
                    </span>
                </form>
            </main>
        </>
    );
};

export default SignIn;
