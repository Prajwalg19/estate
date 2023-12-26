import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import OAuth from "../components/OAuth";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { signFailure, signInStart, signInSuccess } from "../redux/userSlice";
const SignIn = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((store) => {
    return store.user;
  });
  const submit = async (e) => {
    e.preventDefault();
    let error = [];
    for (const d in data) {
      if (data[d] == "") error.push("empty");
    }

    if (error.length) {
      dispatch(signFailure("Enter the Credentials"));
      return;
    }
    try {
      dispatch(signInStart());
      let response = await axios.post("api/auth/signin/", data);
      response = response.data;
      if (response.success) {
        navigate("/");
        dispatch(signInSuccess(response.user));
      }
    } catch (error) {
      if (error?.response) {
        dispatch(signFailure(error.response.data.message));
      } else {
        dispatch(signFailure("Internal Server Error"));
      }
    }
  };
  return (
    <>
      <main className="flex flex-col items-center w-full max-w-6xl px-3 mx-auto my-3">
        <h1 className="text-2xl font-semibold my-7">Sign In</h1>
        <form className="relative flex flex-col w-full max-w-md mx-auto gap-y-4">
          <input
            required
            onChange={(e) =>
              setData((prev) => ({ ...prev, email: e.target.value }))
            }
            type="email"
            placeholder="Email"
            className="p-3 border-gray-400 rounded-md"
          />
          <div className="relative">
            <input
              required
              onChange={(e) =>
                setData((prev) => ({ ...prev, password: e.target.value }))
              }
              type={`${visible ? "text" : "password"}`}
              placeholder="password"
              className="w-full p-3 border-gray-400 rounded-md"
            />

            <div
              onClick={() => setVisible(!visible)}
              className="absolute cursor-pointer top-4 right-4"
            >
              {visible ? <AiFillEye /> : <AiFillEyeInvisible />}
            </div>
          </div>
          <button
            disabled={loading}
            onClick={submit}
            className="w-full p-2 font-normal text-white rounded-md bg-slate-700 hover:bg-slate-800 active:bg-slate-900 transition ease-in-out"
          >
            {loading ? "Signing In" : "Sign In"}
          </button>
          <OAuth />
          <span className="relative left-0 text-sm font-medium">
            Don&#39;t Have An Account ?{" "}
            <Link className="text-blue-600 " to="/signup">
              Register
            </Link>
            <p className="mt-3 text-red-600">{error}</p>
          </span>
        </form>
      </main>
    </>
  );
};

export default SignIn;
