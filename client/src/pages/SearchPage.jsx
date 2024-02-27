import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axiosConfig";
import { RiMapPin2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
function SearchPage() {
  const navigate = useNavigate();
  const { search } = useLocation(); //search is the key that contains the query string that we will work with , other keys are pathname ,hash ,state and key
  const [queriedListings, setQueriedListings] = useState([]);
  const [myString, setMyString] = useState("");
  const [showMore, setShowMore] = useState(true);
  const [filter, setFilter] = useState({
    type: "all",
    parking: false,
    offer: false,
    furnished: false,
    sort: "createdAt",
    order: "desc",
    startIndex: 0,
  });
  const [loading, setLoading] = useState(true);
  const { sort, order, type, parking, offer, furnished, startIndex } = filter;
  useEffect(() => {
    async function fetchTheResult() {
      setLoading(true);
      const allParams = new URLSearchParams(search); // manipulate the query parameters of the URL
      const searchTerm = allParams.get("searchTerm");
      const offer = allParams.get("offer") == "true ";

      const furnished = allParams.get("furnished") == "true";
      const parking = allParams.get("parking") == "true";
      const type = allParams.get("type") ?? "all";
      const sort = allParams.get("sort") ?? "createdAt";
      const order =
        allParams.get("order") != "desc" || allParams.get("order") != "asc"
          ? "desc"
          : "asc";
      setMyString(searchTerm);
      setFilter({
        offer,
        furnished,
        parking,
        type,
        sort,
        order,
      });
      let queryString = `searchTerm=${searchTerm}&offer=${offer}&type=${type}&furnished=${furnished}&parking=${parking}&sort=${sort}&order=${order}`;
      let result = await axios.get(`/api/listings/search?${queryString}`);
      result = result.data;
      if (result.length < 3) setShowMore(false);
      else setShowMore(true);
      setQueriedListings(result);
      setLoading(false);
    }

    fetchTheResult();
  }, [search]);

  async function handleMore() {
    const indexSet = new URLSearchParams(search);
    const count = queriedListings.length;
    indexSet.set("startIndex", count);
    let queryString = indexSet.toString();
    let result = await axios.get(`/api/listings/search?${queryString}`);
    if (result.data.length < 3) setShowMore(false);
    setQueriedListings((prev) => [...prev, ...result.data]);
  }
  function filterFunc(e) {
    let target = e.target.id;
    if (target == "parking" || target == "offer" || target == "furnished") {
      setFilter((prev) => ({ ...prev, [target]: !filter[e.target.id] }));
    } else if (target == "all" || target == "rent" || target == "sale") {
      setFilter((prev) => ({ ...prev, type: e.target.id }));
    } else if (target == "sort_order") {
      let arr = e.target.value.split("_");
      let sort = arr[0] || "createdAt";
      let order = arr[1] || "desc";
      setFilter((prev) => ({
        ...prev,
        sort,
        order,
      }));
    }
  }
  async function getListings() {
    const queryURL = `?searchTerm=${myString}&parking=${parking}&offer=${offer}&furnished=${furnished}&type=${type}&sort=${sort}&order=${order}`;
    navigate(queryURL);
  }
  return (
    <div className="flex flex-col md:flex-row">
      <aside className="w-full p-2 my-4 border-r-2 border-gray-300 md:min-h-screen md:max-w-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            getListings();
          }}
          className="flex flex-wrap items-center w-full p-2 m-2 gap-1"
        >
          <span className="text-base font-semibold">Search Term : </span>
          <input
            type="text"
            className="px-3 py-2 rounded-md"
            placeholder="Search"
            onChange={(e) => setMyString(e.target.value)}
            value={myString}
          />
        </form>
        <div className="p-2 m-2 text-lg font-semibold">Filters : </div>
        <ul className="flex flex-wrap items-center p-2 m-2 text-lg gap-4">
          <li className="flex gap-1">
            <input
              type="checkbox"
              className="w-4"
              id="all"
              onChange={filterFunc}
              checked={type == "all"}
            />
            <span> Rent &amp; Sale</span>
          </li>
          <li className="flex gap-1">
            <input
              type="checkbox"
              className="w-4"
              checked={type == "rent"}
              onChange={filterFunc}
              id="rent"
            />
            <span>Rent</span>
          </li>
          <li className="flex gap-1">
            <input
              type="checkbox"
              className="w-4"
              checked={type == "sale"}
              id="sale"
              onChange={filterFunc}
            />
            <span>Sale</span>
          </li>
          <li className="flex gap-1">
            <input
              type="checkbox"
              className="w-4"
              id="offer"
              checked={JSON.parse(offer)}
              onChange={filterFunc}
            />
            <span>Offer</span>
          </li>
          <li className="flex gap-1">
            <input
              type="checkbox"
              className="w-4"
              id="furnished"
              checked={JSON.parse(furnished)}
              onChange={filterFunc}
            />
            <span>Furnished</span>
          </li>
          <li className="flex gap-1">
            <input
              type="checkbox"
              className="w-4"
              checked={JSON.parse(parking)}
              onChange={filterFunc}
              id="parking"
            />
            <span>Parking</span>
          </li>
        </ul>
        <div className="p-2 m-2">
          <span className="text-lg font-semibold">Sort By : </span>
          <select
            className="p-2 border rounded-lg"
            id="sort_order"
            onChange={filterFunc}
            defaultValue="createdAt_desc"
          >
            <option value="originalPrice_asc">By Rate Ascending</option>
            <option value="originalPrice_desc">By Rate Descending</option>
            <option value="createdAt_desc">Latest</option>
            <option value="createdAt_asc">Oldest</option>
          </select>
        </div>
        <button
          type="button"
          onClick={getListings}
          className="w-full p-2 font-semibold text-white bg-slate-700 rounded-md"
        >
          Search
        </button>
      </aside>

      {loading ? (
        <div className="flex items-center justify-center w-full ">
          <p className="text-2xl font-semibold">Loading.... </p>
        </div>
      ) : (
        <section className="flex flex-col m-4 className gap-4">
          {queriedListings.length != 0 ? (
            <h1 className="text-2xl font-semibold">Listings</h1>
          ) : (
            <h1 className="text-2xl font-semibold">
              Oops! No Such Listings Found
            </h1>
          )}
          <div className="flex flex-wrap gap-4 ">
            {queriedListings.map((item, index) => (
              <div
                key={index}
                className="w-full cursor-pointer overflow-hidden flex flex-col  sm:w-[300px] hover:shadow-lg transition ease-in-out rounded-md"
                onClick={() => navigate(`/listing/${item._id}`)}
              >
                <img
                  src={
                    item.imgURL[0] ||
                    "http://t2.gstatic.com/licensed-image?q=tbn:ANd9GcTX19Q99-N_W0IN5HncS01yMrAP7gEn86NSfczhe99NE80UFZryIBG-xyItgsGDPMbzuttmNpY3XUpjQ__LGYk"
                  }
                  className="hover:scale-[105%] transition ease-in-out w-full h-[300px]  object-cover rounded-md"
                />
                <div className="flex flex-col w-full p-3 bg-white gap-2 rounded-md">
                  <span className="font-semibold truncate">{item.name}</span>
                  <span className="flex items-center gap-2">
                    <RiMapPin2Fill className="w-4 h-4 text-green-600" />
                    <span className="text-sm line-clamp-1">{item.address}</span>
                  </span>
                  <span className="text-sm line-clamp-1">
                    &#8377;
                    {item.offer == true
                      ? item.discountedPrice
                      : item.originalPrice}
                    {item.type == "rent" ? " / month" : ""}
                  </span>
                  <span className="flex items-center font-medium gap-3">
                    <span className="text-xs">{item.bedrooms} beds</span>
                    <span className="text-xs">{item.bathrooms} baths</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
          {showMore && (
            <div
              className="text-lg text-center text-purple-700 cursor-pointer"
              onClick={handleMore}
            >
              More
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default SearchPage;
