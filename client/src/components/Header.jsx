import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { currentUser } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const location = useLocation();
  const queryString = location.search;
  const [searchText, setSearchText] = useState("");
  function searchPage(query) {
    navigate(`/search?searchTerm=${query}`);
  }

  useEffect(() => {
    let term = new URLSearchParams(queryString).get("searchTerm");
    let searchTerm = term ?? "";
    setSearchText(searchTerm);
  }, [queryString]);
  return (
    <header className="flex flex-wrap items-center w-full px-3 py-3 shadow-md bg-slate-200">
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
        <Link to="/">
          <span className="text-sm font-semibold md:text-lg">
            <span className="text-zinc-700">Real</span>
            <span className="text-slate-500">Estate</span>
          </span>
        </Link>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchPage(searchText);
          }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            value={searchText}
            className="w-24 px-2 py-2 mx-1 border-gray-500 focus:outline-none sm:w-auto md:mx-0 rounded-md"
          />
          <button
            type="submit"
            className="absolute cursor-pointer right-3 top-3"
          >
            <BsSearch />
          </button>
        </form>
        <ul className="flex justify-center text-base font-medium space-x-3 ">
          <li className="hidden sm:inline hover:underline ">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:underline ">
            <Link to="/about">About</Link>
          </li>
          {currentUser ? (
            <li className="">
              <Link to="/profile">
                <img
                  src={`${currentUser.photoURL}`}
                  className="object-cover w-6 h-6 rounded-full"
                />
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
