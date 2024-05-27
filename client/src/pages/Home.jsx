import { useEffect, useState } from "react";
import axios from "../config/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { register } from "swiper/element/bundle";
import { RiMapPin2Fill } from "react-icons/ri";
import Spinner from "../components/Loading";
const Home = () => {
  register();
  const [offersList, setOffersList] = useState([]);
  const [rentList, setRentList] = useState([]);
  const [saleList, setSaleList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOffers() {
      setLoading(true)
      let result = await axios.get("/api/listings/search?offer=true&limit=5");
      result = result.data;
      setOffersList(result);
      fetchRent();
    }
    async function fetchRent() {
      let result = await axios.get("/api/listings/search?type=rent&limit=5");
      result = result.data;
      setRentList(result);
      fetchSale();
    }

    async function fetchSale() {
      let result = await axios.get("/api/listings/search?offer=true&limit=5");
      result = result.data;
      setSaleList(result);
      setLoading(false)
    }
    fetchOffers();
  }, []);
  
  if(loading){
    return <Spinner/>
  }
  return (
    <main className="py-2">
      <div className="flex flex-col max-w-6xl pt-20 pl-4 mx-auto text-slate-700 gap-3">
        <p className="text-3xl font-bold sm:text-5xl">
          The best place to find your <br />
          <span className="text-slate-500">home </span>
        </p>
        <p className="text-sm text-slate-500">
          Find the house from where you are, all at the tip of your fingers
          <br />
        </p>
        <Link
          to="/search"
          className="text-sm font-semibold text-purple-700 hover:underline"
        >
          Start finding your home
        </Link>
      </div>

      <div className="mt-20 mb-16">
        <swiper-container
          navigation="true"
          speed="500"
          loop="true"
          css-mode="true"
          autoplay="true"
          autoplay-delay="2000"
          pagination="true"
        >
          {offersList.map((item, index) => (
            <swiper-slide key={index}>
              <img
                src={item.imgURL[0]}
                className="object-cover h-[500px] w-full"
              />
            </swiper-slide>
          ))}
        </swiper-container>
      </div>
      <div className="max-w-6xl px-2 py-3 mx-auto space-y-20">
        <section>
          <div className="py-3">
            <p className="font-semibold">Houses on offer</p>
            <Link
              to={`/search?offer=true`}
              className="text-xs text-blue-700 hover:underline"
            >
              Show more offers
            </Link>
          </div>
          <div className="flex flex-col flex-wrap sm:flex-row gap-5">
            {offersList.map((item, index) => (
              <div
                key={index}
                className="hover:shadow-lg overflow-hidden shadow-md transition ease-in-out w-full sm:w-[300px] flex flex-col cursor-pointer"
                onClick={() => navigate(`/listing/${item._id}`)}
              >
                <img
                  src={item.imgURL[0]}
                  className="hover:scale-[105%] transition ease-in-out duration-300 h-[300px] object-cover rounded-md"
                />
                <div className="flex flex-col p-1 bg-white rounded-md gap-2">
                  <span className="font-semibold truncate">{item.name}</span>
                  <span className="flex items-center gap-1">
                    <RiMapPin2Fill className="w-4 h-4 text-green-600 " />
                    <span className="w-full text-xs truncate">
                      {item.address}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-gray-500">
                    &#8377;
                    {item.offer == "true"
                      ? item.discountedPrice
                      : item.originalPrice}
                    {item.type == "rent" ? " / month" : ""}
                  </span>
                  <span className="flex items-center text-xs font-semibold gap-2">
                    <span>{item.bedrooms} beds</span>
                    <span>{item.bathrooms} baths</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <div className="py-3">
            <p className="font-semibold">Houses for rent</p>
            <Link
              to={`/search?type=rent`}
              className="text-xs text-blue-700 hover:underline"
            >
              Show more houses for rent
            </Link>
          </div>
          <div className="flex flex-col flex-wrap sm:flex-row gap-5">
            {rentList.map((item, index) => (
              <div
                key={index}
                className="hover:shadow-lg overflow-hidden shadow-md transition ease-in-out w-full sm:w-[300px] flex flex-col cursor-pointer"
                onClick={() => navigate(`/listing/${item._id}`)}
              >
                <img
                  src={item.imgURL[0]}
                  className="hover:scale-[105%] transition ease-in-out duration-300 h-[300px] object-cover rounded-md"
                />
                <div className="flex flex-col p-1 bg-white rounded-md gap-2">
                  <span className="font-semibold truncate">{item.name}</span>
                  <span className="flex items-center gap-1">
                    <RiMapPin2Fill className="w-4 h-4 text-green-600 " />
                    <span className="w-full text-xs truncate">
                      {item.address}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-gray-500">
                    &#8377;
                    {item.offer == "true"
                      ? item.discountedPrice
                      : item.originalPrice}
                    {item.type == "rent" ? " / month" : ""}
                  </span>
                  <span className="flex items-center text-xs font-semibold gap-2">
                    <span>{item.bedrooms} beds</span>
                    <span>{item.bathrooms} baths</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="py-3">
            <p className="font-semibold">Houses for Sale</p>
            <Link
              to={`/search?type=sale`}
              className="text-xs text-blue-700 hover:underline"
            >
              Show more houses on sale
            </Link>
          </div>
          <div className="flex flex-col flex-wrap sm:flex-row gap-5">
            {saleList.map((item, index) => (
              <div
                key={index}
                className="hover:shadow-lg overflow-hidden shadow-md transition ease-in-out w-full sm:w-[300px] flex flex-col cursor-pointer"
                onClick={() => navigate(`/listing/${item._id}`)}
              >
                <img
                  src={item.imgURL[0]}
                  className="hover:scale-[105%] transition ease-in-out duration-300 h-[300px] object-cover rounded-md"
                />
                <div className="flex flex-col p-1 bg-white rounded-md gap-2">
                  <span className="font-semibold truncate">{item.name}</span>
                  <span className="flex items-center gap-1">
                    <RiMapPin2Fill className="w-4 h-4 text-green-600 " />
                    <span className="w-full text-xs truncate">
                      {item.address}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-gray-500">
                    &#8377;
                    {item.offer == "true"
                      ? item.discountedPrice
                      : item.originalPrice}
                    {item.type == "rent" ? " / month" : ""}
                  </span>
                  <span className="flex items-center text-xs font-semibold gap-2">
                    <span>{item.bedrooms} beds</span>
                    <span>{item.bathrooms} baths</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
