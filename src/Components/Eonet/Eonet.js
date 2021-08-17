import { useEffect, useState } from "react";

import Map from "./Map/Map";
import axios from "axios";
import useSwr from "swr";

import "./Eonet.css";
const Eonet = () => {
  const [eonetDataEvents, setEonetDataEvents] = useState(null);
  const [title, setTitle] = useState(null);
  const [titleExists, setTitleExists] = useState(false);
  const [eonetDataExists, setEonetDataExists] = useState(false);
  const url = "https://eonet.sci.gsfc.nasa.gov/api/v3/events";
  const fetcher = (url) =>
    axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => {
        setTitleExists(true);
        setTitle("Connection error! Please try again");
      });
  const { data, error } = useSwr(url, fetcher);

  useEffect(() => {
    if (data) {
      if (sessionStorage.getItem("eonetData") != null) {
        const storedData = JSON.parse(sessionStorage.getItem("eonetData"));
        setEonetDataEvents(storedData.events);
        setTitle(storedData.title);
        setTitleExists(true);
      } else {
        sessionStorage.setItem("eonetData", JSON.stringify(data));
        setEonetDataEvents(data.events);
        setTitle(data.title);
        setTitleExists(true);
        console.log("Data fetched across the web");
      }
    } else {
      console.log("Data isn't available");
    }
  }, [data, error]);

  useEffect(() => {
    if (eonetDataEvents !== null) {
      setEonetDataExists(true);
    }
  }, [eonetDataEvents]);

  return (
    <div className="Eonet">
      {titleExists && <h2>{title}</h2>}
      {eonetDataExists && <Map eventsData={eonetDataEvents} />}
    </div>
  );
};

export default Eonet;
