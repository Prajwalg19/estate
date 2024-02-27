import { useEffect, useState } from "react";
import { register } from "swiper/element/bundle";
import axios from "../config/axiosConfig";
import { useParams } from "react-router-dom";
import { RiMapPin2Fill } from "react-icons/ri";
import { FaBath, FaBed, FaParking, FaChair } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";
const Listing = () => {
  register();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [copy, setCopy] = useState(false);
  const { currentUser } = useSelector((store) => {
    return store.user;
  });
  const param = useParams();
  useEffect(() => {
    async function getListingImages() {
      try {
        setLoading(true);
        setError(false);
        const response = await axios.get(`api/listings/getListing/${param.id}`);
        if (response.status == 200) {
          setListing(response.data);
          setLoading(false);
        } else {
          setLoading(false);
          setError(true);
          return;
        }
      } catch (e) {
        setLoading(false);
        setError(true);
      }
    }

    getListingImages();
  }, []);
  if (loading) {
    return <h1 className="my-12 text-2xl text-center">Loading.....</h1>;
  }
  if (error) {
    return (
      <h1 className="my-12 text-2xl text-center">Oops! Something went wrong</h1>
    );
  }

  function copyUrl() {
    window.navigator.clipboard.writeText(window.location.href);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  }
  return (
    <main className="relative w-full pb-2">
      <swiper-container
        navigation="true"
        slides-per-view="1"
        speed="500"
        loop="true"
        css-mode="true"
        autoplay="true"
        autoplay-delay="2000"
        pagination="true"
      >
        {listing &&
          listing.imgURL.length != 0 &&
          listing.imgURL.map((item, index) => (
            <swiper-slide key={index}>
              <img
                src={`${item}`}
                className="object-cover w-full h-[600px] bg-no-repeat"
              />
            </swiper-slide>
          ))}
      </swiper-container>

      {listing && (
        <section className="flex flex-col max-w-6xl px-2 mx-auto my-4 gap-6">
          <div className="text-2xl font-semibold">
            {listing.name} - &#8377;
            {listing.offer ? listing.discountedPrice : listing.originalPrice}
            {listing.type == "sale" ? "" : " / month"}
          </div>
          <div className="flex items-center font-medium gap-2">
            <RiMapPin2Fill />
            <p>{listing.address}</p>
          </div>
          <div className="flex items-center font-medium gap-2 ">
            <span className="px-10 py-2 text-white capitalize bg-purple-700 rounded-md">
              {listing.type}
            </span>
            {listing.offer && (
              <span className="px-3 py-2 text-white bg-green-600 rounded-md">
                &#8377;{+listing.originalPrice - +listing.discountedPrice}{" "}
                Discount
              </span>
            )}
          </div>

          <div>
            <span className="font-semibold">Description</span> -{" "}
            {listing.description}
          </div>
          <div className="flex flex-wrap items-center font-semibold gap-7 ">
            <span className="flex items-center gap-1">
              <FaBath />
              {listing.bathrooms} Bath
            </span>
            <span className="flex items-center gap-1">
              <FaBed />
              {listing.bathrooms} Beds
            </span>
            <span className="flex items-center gap-1">
              <FaParking />
              {listing.parking ? "Parking" : "No Parking"}
            </span>

            <span className="flex items-center gap-1">
              <FaChair />
              {listing.furnished ? "Furnished" : "Unfurnished"}
            </span>
          </div>

          {currentUser && listing.userRef != currentUser._id && (
            <button
              type="button"
              className={`w-full py-2 my-1 font-semibold text-white uppercase bg-slate-700 rounded-md  ${
                showContact && "hidden"
              }`}
              onClick={() => setShowContact(true)}
            >
              Contact Owner
            </button>
          )}

          {showContact && <Contact details={listing} />}
        </section>
      )}

      <IoIosShareAlt
        onClick={copyUrl}
        className="cursor-pointer absolute top-12 right-10 z-[1] p-1 text-4xl bg-white rounded-full"
      />
      {copy && (
        <section className="absolute top-24 right-16 rounded-md z-[1] px-2 py-1  bg-white text-black">
          Link Copied
        </section>
      )}
    </main>
  );
};

export default Listing;
