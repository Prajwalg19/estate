import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  logOut,
  updateUserFail,
  updateUserStart,
  updateUserSuccess,
} from "../redux/userSlice";
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
  const [allListings, setAllListings] = useState([]);
  const [pfp, setPfp] = useState(null);

  const [data, setData] = useState({
    _id: currentUser._id,
    userName: currentUser.userName,
    email: currentUser.email,
  });

  useEffect(() => {
    if (pfp) {
      const storage = getStorage(app);
      const storeRef = ref(
        storage,
        Math.random().toString(36).slice(-6) + pfp.name
      );
      const uploadTask = uploadBytesResumable(storeRef, pfp);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
      const response = await axios.post(
        `api/user/update/${currentUser._id}`,
        data
      );
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
      const response = await axios.delete(
        `/api/user/delete/${currentUser._id}`
      );
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

  const getListings = async () => {
    const res = await axios.get(`/api/listings/getListings/${currentUser._id}`);
    setAllListings(res.data);
  };
  const deleteListing = async (listingID) => {
    const res = await axios.delete(`/api/listings/deleteListing/${listingID}`);
    if (res.status == 200) {
      setAllListings(
        allListings.filter((item) => {
          return item._id != listingID ? true : false;
        })
      );
    } else {
      console.log(res);
      return;
    }
  };
  return (
    <main className="flex flex-col justify-center w-full max-w-6xl p-2 pb-5 mx-auto">
      <h1 className="my-10 text-3xl font-semibold text-center">Profile</h1>

      <form className="flex flex-col items-center w-full max-w-md px-3 mx-auto gap-6">
        <input
          ref={fileRef}
          accept="image/*"
          type="file"
          className="hidden"
          onChange={(e) => setPfp(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          className="object-cover w-20 h-20 mb-3 rounded-full cursor-pointer"
          src={data?.photoURL || currentUser.photoURL}
        />
        <p className="text-sm">
          {prec && prec != "100" ? (
            <span className="text-red-600">{prec}% Complete</span>
          ) : fileError ? (
            <span className="text-red-600">File Size Cannot be &#62;2mb </span>
          ) : prec == "100" ? (
            <span className="text-sm text-green-600">Upload Successful</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          onChange={(e) =>
            setData((prev) => ({ ...prev, userName: e.target.value }))
          }
          defaultValue={data.userName}
          className="w-full p-3 border-gray-500 rounded-md"
          placeholder="Username"
        />
        <input
          type="email"
          onChange={(e) =>
            setData((prev) => ({ ...prev, email: e.target.value }))
          }
          defaultValue={data.email}
          className="w-full p-3 border-gray-500 rounded-md"
          placeholder="Email"
        />
        <input
          type="password"
          onChange={(e) =>
            setData((prev) => ({ ...prev, password: e.target.value }))
          }
          className="w-full p-3 border-gray-500 rounded-md"
          placeholder="Password"
        />
        <button
          disabled={loading}
          onClick={update}
          className="w-full p-2 text-white bg-slate-700 hover:bg-slate-800 active:bg-slate-900 rounded-md"
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <Link
          to={`/create-listing`}
          className="w-full p-2 text-center text-white bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-md"
        >
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

        {allListings.length > 0 ? (
          <div className="w-full">
            <h2 className="my-4 text-xl font-bold text-center">
              Your listings
            </h2>
            {allListings.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between w-full p-2 mt-5 border-2 border-gray-300 gap-3"
              >
                <img
                  src={item.imgURL[0]}
                  className="object-cover rounded-md w-14 h-14"
                />
                <p className="text-sm font-semibold truncate cursor-pointer hover:underline ">
                  {item.name}
                </p>
                <div className="flex flex-col items-center justify-center text-sm">
                  <p
                    className="text-red-600 cursor-pointer"
                    onClick={() => deleteListing(item._id)}
                  >
                    Delete
                  </p>
                  <p className="text-green-500 cursor-pointer">
                    <Link to={`/update-listing/${item._id}`}>Edit</Link>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p
            className="text-sm font-semibold text-green-500 cursor-pointer"
            onClick={getListings}
          >
            Show Listings
          </p>
        )}
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : updateStatus ? (
          <p className="text-sm text-green-600">Update Successful</p>
        ) : (
          ""
        )}
      </form>
    </main>
  );
};

export default Profile;
