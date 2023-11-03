import { BsSearch } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const Header = () => {
    const { currentUser } = useSelector((store) => store.user);
    return (
        <header className="flex items-center  w-full py-3 shadow-md bg-slate-200 flex-wrap px-3">
            <div className="flex justify-between items-center max-w-6xl w-full mx-auto">
                <Link to="/">
                    <span className="md:text-lg text-sm font-semibold">
                        <span className="text-zinc-700">Real</span>
                        <span className="text-slate-500">Estate</span>
                    </span>
                </Link>
                <span className="relative">
                    <input type="text" placeholder="Search" className="focus:outline-none w-24 sm:w-auto mx-1 md:mx-0 rounded-md border-gray-500 px-2 py-2" />
                    <div className=" absolute right-3 top-3">
                        <BsSearch />
                    </div>
                </span>
                <ul className="text-base justify-center font-medium flex space-x-3 ">
                    <li className="hidden sm:inline hover:underline ">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="hover:underline ">
                        <Link to="/about">About</Link>
                    </li>
                    {currentUser ? (
                        <li>
                            <Link to="/profile">
                                <img src={`${currentUser.user.photoURL}`} className="rounded-full h-6 w-6 object-cover" />
                            </Link>
                        </li>
                    ) : (
                        <li className="hover:underline ">
                            <Link to="signin">Sign in</Link>
                        </li>
                    )}
                </ul>
            </div>
        </header>
    );
};

export default Header;
