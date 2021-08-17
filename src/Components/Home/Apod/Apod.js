import React, { useEffect, useState } from "react";

import axios from "axios";
import useSwr from "swr";

import "./Apod.css";

const Apod = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [isImage, setIsImage] = useState(false);
  const url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`;

  const fetcher = (url) =>
    axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => {
        console.log(
          "Image could not be fetched this time. Please try again later."
        );
      });
  const { data, error } = useSwr(url, fetcher);

  useEffect(() => {
    if (data) {
      if (sessionStorage.getItem("apodData") != null) {
        const storedData = JSON.parse(sessionStorage.getItem("apodData"));
        setIsImage(true);
        setImageUrl(storedData.hdurl);
        setImageTitle(storedData.title);
      } else {
        sessionStorage.setItem("apodData", JSON.stringify(data));
        setIsImage(true);
        setImageUrl(data.hdurl);
        setImageTitle(data.title);
        console.log("Url wasn't stored in sessionStorage");
      }
    } else {
      console.log("Data isn't available at the moment");
    }
  }, [data, error]);

  return (
    <>
      {isImage && (
        <img src={imageUrl} alt={imageTitle} className="apod-image" />
      )}
    </>
  );
};

export default Apod;
