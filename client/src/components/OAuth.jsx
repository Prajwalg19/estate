import { app } from "../firebase";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import axios from "../config/axiosConfig.js";
import { signFailure, signInStart, signInSuccess } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function OAuth() {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const { OAuthLoading } = useSelector((store) => {
    return store.user;
  });
  const login = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart({ OAuth: "OAuth" }));
      const result = await signInWithPopup(auth, provider);
      const data = {
        userName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      };
      let response = await axios.post("/api/auth/OAuth/", data);
      dispatch(signInSuccess({ data: response.data.user, OAuth: "OAuth" }));
      navigate("/");
    } catch (error) {
      if (error?.response) {
        dispatch(
          signFailure({ OAuth: "OAuth", error: error.response.data.message })
        );
      } else {
        dispatch(signFailure({ OAuth: "OAuth", error: "Server Timed out" }));
      }
    }
  };
  return (
    <button
      disabled={OAuthLoading}
      onClick={login}
      type="button"
      className="w-full p-2 text-white bg-red-700 rounded-md hover:bg-red-800 active:bg-red-900 transition ease-in-out"
    >
      {OAuthLoading ? "Loading..." : "Continue with google"}
    </button>
  );
}
export default OAuth;
