import { useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
function CreateListing() {
  const [listingImg, setListingImg] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState("");
  const storage = getStorage(app);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    furnished: "",
    originalPrice: "",
    discountedPrice: "",
    bedrooms: "",
    bathrooms: "",
    parking: "",
    offer: "",
    imgURL: [],
    userRef: "",
    type: "",
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
        const drunk = await Promise.all(promises);
        setFormData((prev) => ({ ...prev, imgURL: prev.imgURL.concat(drunk) }));
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
  return (
    <main>
      <h1 className="p-2 my-5 text-2xl font-bold text-center ">
        Create a Listing
      </h1>
      <form className="flex flex-col w-full max-w-4xl p-2 mx-auto sm:flex-row gap-4">
        <section className="flex flex-col flex-1 gap-4">
          <input
            required
            type="text"
            className="p-2 rounded-md"
            placeholder="Name"
          />
          <textarea
            required
            cols="30"
            rows="2"
            placeholder="Description"
            className="p-2 rounded-md"
          ></textarea>
          <input
            required
            type="text"
            className="p-2 rounded-md"
            placeholder="Address"
          />
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1">
              <input id="sell" type="checkbox" className="w-4 " />
              <label htmlFor="sell">Sell</label>
            </div>
            <div className="flex gap-1">
              <input id="rent" type="checkbox" className="w-4" />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-1">
              <input id="parking" type="checkbox" className="w-4" />
              <label htmlFor="parking">Parking Spot</label>
            </div>
            <div className="flex gap-1">
              <input id="furnished" type="checkbox" className="w-4" />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex gap-1">
              <input id="offer" type="checkbox" className="w-4" />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium whitespace-nowrap">
              Beds :{" "}
            </span>
            <input
              type="number"
              className="w-1/4 p-2 text-center rounded-md"
              min="1"
            />
            <span className="text-sm font-medium test-sm whitespace-nowrap">
              Bathrooms :{" "}
            </span>
            <input
              type="number"
              className="w-1/4 p-2 text-center rounded-md"
              min="1"
            />
          </div>

          <p className="flex items-center justify-between space-x-3">
            <span className="flex flex-col items-center text-sm">
              <span>Regular Price :</span>
              <span>(&#8377;/Month )</span>
            </span>
            <input type="number" min="0" className="w-1/3 p-2 rounded-md" />
          </p>
          <p className="flex items-center justify-between space-x-3">
            <span className="flex flex-col items-center text-sm">
              <span>Discounted Price :</span>
              <span>(&#8377;/Month )</span>
            </span>
            <input type="number" min="0" className="w-1/3 p-2 rounded-md" />
          </p>
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
          <button className="w-full p-2 mt-4 text-white bg-slate-700 rounded-md">
            Create Listing
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
