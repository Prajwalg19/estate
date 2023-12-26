import { useState } from "react";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axios from "../config/axiosConfig";
import { useSelector } from "react-redux";
function CreateListing() {
  const [listingImg, setListingImg] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState("");
  const storage = getStorage(app);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userID = useSelector((state) => {
    return state.user.currentUser._id;
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    furnished: false,
    originalPrice: 1000,
    discountedPrice: 0,
    bedrooms: 0,
    bathrooms: 0,
    parking: false,
    offer: false,
    imgURL: [],
    userRef: "",
    type: "rent",
  });
  const { imgURL } = formData;
  const uploadImg = async () => {
    try {
      if (
        listingImg.length > 0 &&
        formData.imgURL.length + listingImg.length < 7
      ) {
        setUploadLoading(true);
        setError("");
        let promises = [];
        for (let i = 0; i < listingImg.length; i++) {
          promises.push(singleImgUpload(listingImg[i]));
        }
        const imageArr = await Promise.all(promises);
        setFormData((prev) => ({
          ...prev,
          imgURL: prev.imgURL.concat(imageArr),
        }));
        setUploadLoading(false);
      } else {
        setError("Images Size or Numbers Don't Match");
      }
    } catch (e) {
      setUploadLoading(false);
      setError("Image Upload Failed");
    }
  };
  const deleteImg = (img, index) => {
    setFormData({
      ...formData,
      imgURL: formData.imgURL.filter((_, ind) => {
        return ind != index ? true : false;
      }),
    });
  };

  const singleImgUpload = async (img) => {
    const imgRef = ref(storage, Math.random().toString().slice(-4) + img.name);
    const uploadTask = uploadBytesResumable(imgRef, img);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((URL) => {
            resolve(URL);
          });
        }
      );
    });
  };
  const fillFormData = (e) => {
    if (e.target.id == "sale" || e.target.id == "rent") {
      setFormData({ ...formData, type: e.target.id });
      return;
    }
    if (
      e.target.id == "parking" ||
      e.target.id == "offer" ||
      e.target.id == "furnished"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: !formData[e.target.id],
      });
      return;
    }

    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const submitForm = async (e) => {
    e.preventDefault();
    if (formData.offer && +formData.discountedPrice >= +formData.originalPrice)
      return setError("Discounted Price cannot be greater than Regular Price");
    if (formData.imgURL < 1)
      return setError("Atleast one image has to be selected");
    setLoading(true);
    const res = await axios.post("/api/listings/createListing", {
      ...formData,
      userRef: userID,
    });
    console.log(res.data.status);
    setLoading(false);
    if (res?.data.status == "success") {
      navigate(`/listing/${res.data.listingData._id}`);
    }
  };
  return (
    <main>
      <h1 className="p-2 my-5 text-2xl font-bold text-center ">
        Create a Listing
      </h1>
      <form
        onSubmit={submitForm}
        className="flex flex-col w-full max-w-4xl p-4 mx-auto sm:flex-row gap-4"
      >
        <section className="flex flex-col flex-1 gap-4">
          <input
            required
            type="text"
            className="p-2 rounded-md"
            placeholder="Name"
            id="name"
            onChange={fillFormData}
          />
          <textarea
            required
            cols="30"
            rows="2"
            placeholder="Description"
            className="p-2 rounded-md"
            id="description"
            onChange={fillFormData}
          ></textarea>
          <input
            required
            type="text"
            className="p-2 rounded-md"
            placeholder="Address"
            id="address"
            onChange={fillFormData}
          />
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1">
              <input
                id="sale"
                type="checkbox"
                className="w-4"
                checked={formData.type == "sale"}
                onChange={fillFormData}
              />
              <label htmlFor="sale">Sale</label>
            </div>
            <div className="flex gap-1">
              <input
                id="rent"
                type="checkbox"
                className="w-4"
                checked={formData.type == "rent"}
                onChange={fillFormData}
              />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-1">
              <input
                id="parking"
                type="checkbox"
                onChange={fillFormData}
                className="w-4"
                checked={formData.parking}
              />
              <label htmlFor="parking">Parking Spot</label>
            </div>
            <div className="flex gap-1">
              <input
                id="furnished"
                checked={formData.furnished}
                onChange={fillFormData}
                type="checkbox"
                className="w-4"
              />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex gap-1">
              <input
                id="offer"
                type="checkbox"
                checked={formData.offer}
                onChange={fillFormData}
                className="w-4"
              />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium whitespace-nowrap">
              Beds :
            </span>
            <input
              type="number"
              className="w-1/4 p-2 text-center rounded-md"
              min="1"
              id="bedrooms"
              onChange={fillFormData}
            />
            <span className="text-sm font-medium test-sm whitespace-nowrap">
              Bathrooms :
            </span>
            <input
              type="number"
              className="w-1/4 p-2 text-center rounded-md"
              min="1"
              id="bathrooms"
              onChange={fillFormData}
            />
          </div>

          <p className="flex items-center justify-between space-x-3">
            <span className="flex flex-col items-center text-sm">
              <span>Regular Price :</span>
              <span>(&#8377;/Month )</span>
            </span>
            <input
              type="number"
              id="originalPrice"
              onChange={fillFormData}
              min="1000"
              className="w-1/3 p-2 rounded-md"
            />
          </p>
          {formData.offer && (
            <p className="flex items-center justify-between space-x-3">
              <span className="flex flex-col items-center text-sm">
                <span>Discounted Price :</span>
                <span>(&#8377;/Month )</span>
              </span>
              <input
                type="number"
                min="1000"
                id="discountedPrice"
                onChange={fillFormData}
                className="w-1/3 p-2 rounded-md"
              />
            </p>
          )}
        </section>
        <section className="flex flex-col flex-1">
          <span className="mb-4">
            <span className="font-semibold">Images:</span>
            <p>The first image will be the cover (Max 6 and Size &#60; 2MB)</p>
          </span>
          <span className="flex justify-between">
            <input
              accept="image/*"
              type="file"
              onChange={(e) => {
                setListingImg([...e.target.files]);
              }}
              className="p-2 border-2 border-gray-300"
              multiple
            />
            <button
              type="button"
              onClick={uploadImg}
              className="px-3 py-2 text-green-500 border-2 border-green-500 hover:shadow-md bg-opacity-0 rounded-md"
              disabled={uploadLoading}
            >
              {uploadLoading ? "Uploading..." : "Upload"}
            </button>
          </span>
          <button
            disabled={loading || uploadLoading}
            className="w-full p-2 mt-4 text-white bg-slate-700 rounded-md disabled:opacity-80"
          >
            {loading ? "Creating Listing" : "Create Listing"}
          </button>
          <p className="flex justify-center p-2">
            {error ? <span className="text-red-600 ">{error}</span> : ""}
          </p>
          {imgURL && imgURL.length != 0
            ? imgURL.map((img, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 my-2 border-2 border-slate-300"
                >
                  <img
                    className="object-cover w-20 h-20 rounded-md"
                    src={img}
                  />
                  <button
                    type="button"
                    className="text-red-700 uppercase"
                    onClick={() => deleteImg(img, index)}
                  >
                    Delete
                  </button>
                </div>
              ))
            : ""}
        </section>
      </form>
    </main>
  );
}

export default CreateListing;
