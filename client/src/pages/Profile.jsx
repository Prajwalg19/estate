import { useRef, useState } from "react";
import { useSelector } from "react-redux";

const Profile = () => {
    const fileRef = useRef();
    const [pfp, setPfp] = useState("");
    const { currentUser } = useSelector((store) => {
        return store.user;
    });
    return (
        <main className="flex flex-col justify-center w-full max-w-6xl mx-auto">
            <h1 className="my-8 text-3xl font-semibold text-center">Profile</h1>

            <form className="flex flex-col w-full max-w-md mx-auto px-3 gap-6 items-center">
                <input ref={fileRef} type="file" className="hidden" onChange={(e) => setPfp(e.target.files)} />
                <img onClick={() => fileRef.current.click()} className="cursor-pointer rounded-full h-20 w-20" src={currentUser.user.photoURL} />
                <input type="text" className="w-full p-3 border-gray-500 rounded-md" placeholder="Username" />
                <input type="email" className="p-3 border-gray-500 rounded-md w-full" placeholder="Email" />
                <input type="password" className="p-3 border-gray-500 rounded-md w-full" placeholder="Password" />
            </form>
        </main>
    );
};

export default Profile;
