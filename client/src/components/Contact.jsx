import { useEffect, useState } from "react";
import axios from "../config/axiosConfig";
import { Link } from "react-router-dom";

function Contact(prop) {
  const details = prop.details;
  const [message, setMessage] = useState("");
  const [ownerInfo, setOwnerInfo] = useState();
  useEffect(() => {
    async function getOwnerName() {
      try {
        let response = await axios.get(
          `api/listings/getOwner/${details.userRef}`
        );
        response = response.data;
        setOwnerInfo(response);
      } catch (_) {
        console.log();
      }
    }
    getOwnerName();
  }, [details.userRef]);

  return (
    <>
      {ownerInfo && (
        <section>
          <p className="mb-3">
            Contact <span className="font-semibold">{ownerInfo.userName}</span>{" "}
            for <span className="font-semibold">{details.name}</span>
          </p>
          <textarea
            id=""
            className="w-full p-2 rounded-md"
            placeholder="Write your query to the owner of this property"
            rows="5"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          ></textarea>
          <Link
            to={`mailto:${ownerInfo.email}?subject=Property ${details.name}&body=${message}`}
            className="w-full"
          >
            <p className="w-full py-2 my-1 font-semibold text-center text-white uppercase bg-slate-700 rounded-md">
              Send message
            </p>
          </Link>
        </section>
      )}
    </>
  );
}

export default Contact;
