import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import { logOut, updateUserFail, updateUserStart, updateUserSuccess } from "../redux/features/user/userSlice";
import axios from "../config/axiosConfig";
import { Link } from "react-router-dom";
const Profile = () => {
    const fileRef = useRef();
    const dispatch = useDispatch();
    const [prec, setPrec] = useState(null);
    const [fileError, setFileError] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(false);
    const { currentUser, loading, error } = useSelector((store) => {
        return store.user;
    });
    const [pfp, setPfp] = useState(null);

    const [data, setData] = useState({
        _id: currentUser._id,
        userName: currentUser.userName,
        email: currentUser.email,
    });

    useEffect(() => {
        if (pfp) {
            const storage = getStorage(app);
            const storeRef = ref(storage, Math.random().toString(36).slice(-6) + pfp.name);
            const uploadTask = uploadBytesResumable(storeRef, pfp);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setPrec(Math.round(progress));
                },
                () => {
                    setFileError(true);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setData((prev) => ({ ...prev, photoURL: downloadURL }));
                    });
                }
            );
        }
        return () => {
            error && dispatch(updateUserFail(null));
        };
    }, [pfp]);

    const update = async (e) => {
        e.preventDefault();
        let demo = [];
        for (const item in data) {
            if (item != "password" && data[item] == "") demo.push("empty");
        }
        if (demo.length != 0) {
            dispatch(updateUserFail("Invalid Credentials"));
            return;
        }
        try {
            dispatch(updateUserStart());
            const response = await axios.post(`api/user/update/${currentUser._id}`, data);
            if (response.status == 200) {
                dispatch(updateUserSuccess(response.data));
                setUpdateStatus(true);
            }
        } catch (error) {
            if (error?.response) {
                dispatch(updateUserFail(error.response.data.message));
            } else {
                dispatch(updateUserFail("Interval Server Error"));
            }
        }
    };
    const logout = () => {
        dispatch(logOut());
    };
    const deleteAccount = async () => {
        try {
            const response = await axios.delete(`/api/user/delete/${currentUser._id}`);
            if (response.data.success) {
                dispatch(logout());
            }
        } catch (error) {
            if (error?.response) {
                dispatch(updateUserFail());
            } else {
                dispatch(updateUserFail("Something went wrong"));
            }
        }
    };
    return (
        <main className="flex flex-col justify-center w-full max-w-6xl p-2 pb-5 mx-auto">
            <h1 className="my-10 text-3xl font-semibold text-center">Profile</h1>

            <form className="flex flex-col items-center w-full max-w-md px-3 mx-auto gap-6">
                <input ref={fileRef} accept="image/*" type="file" className="hidden" onChange={(e) => setPfp(e.target.files[0])} />
                <img onClick={() => fileRef.current.click()} className="object-cover w-20 h-20 mb-3 rounded-full cursor-pointer" src={data?.photoURL || currentUser.photoURL} />
                <p className="text-sm">{prec && prec != "100" ? <span className="text-red-600">{prec}% Complete</span> : fileError ? <span className="text-red-600">File Size Cannot be &#62;2mb </span> : prec == "100" ? <span className="text-sm text-green-600">Upload Successful</span> : ""}</p>
                <input type="text" onChange={(e) => setData((prev) => ({ ...prev, userName: e.target.value }))} defaultValue={data.userName} className="w-full p-3 border-gray-500 rounded-md" placeholder="Username" />
                <input type="email" onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))} defaultValue={data.email} className="w-full p-3 border-gray-500 rounded-md" placeholder="Email" />
                <input type="password" onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))} className="w-full p-3 border-gray-500 rounded-md" placeholder="Password" />
                <button disabled={loading} onClick={update} className="w-full p-2 text-white bg-slate-700 hover:bg-slate-800 active:bg-slate-900 rounded-md">
                    {loading ? "Updating..." : "Update"}
                </button>
                <Link to={`/listing/${currentUser._id}`} className="text-center w-full p-2 text-white bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-md">
                    Create Listing
                </Link>
                <p className="flex justify-between w-full text-sm font-semibold text-red-700">
                    <span className="cursor-pointer" onClick={deleteAccount}>
                        Delete Account
                    </span>
                    <span className="cursor-pointer" onClick={logout}>
                        Sign Out
                    </span>
                </p>
                {error ? <p className="text-sm text-red-600">{error}</p> : updateStatus ? <p className="text-sm text-green-600">Update Successful</p> : ""}
            </form>
        </main>
    );
};

export default Profile;
