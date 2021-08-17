import React, { useState, useEffect, useRef } from "react";
import ReactMapGL, { Marker, Popup, FlyToInterpolator } from "react-map-gl";
import {
  WiHot,
  WiDust,
  WiEarthquake,
  WiFlood,
  WiStormShowers,
  WiSnow,
  WiThermometerExterior,
  WiVolcano,
} from "react-icons/wi";
import { BiWater } from "react-icons/bi";
import { GiFrozenBlock } from "react-icons/gi";
import { ImManWoman, ImFire } from "react-icons/im";
import { FaMountain } from "react-icons/fa";
import useSupercluster from "use-supercluster";
import "./Map.css";

const Map = ({ eventsData }) => {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 0,
    longitude: 0,
    zoom: 2,
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Escape") {
        setSelectedEvent(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  const assignIcon = (event) => {
    if (event.properties.category === "Drought") {
      return <WiHot className={"marker-icon drought"} />;
    } else if (event.properties.category === "Dust and Haze") {
      return <WiDust className={"marker-icon dust-and-haze"} />;
    } else if (event.properties.category === "Earthquakes") {
      return <WiEarthquake className={"marker-icon earthquake"} />;
    } else if (event.properties.category === "Floods") {
      return <WiFlood className={"marker-icon flood"} />;
    } else if (event.properties.category === "Landslides") {
      return <FaMountain className={"marker-icon landslide"} />;
    } else if (event.properties.category === "Manmade") {
      return <ImManWoman className={"marker-icon man-made"} />;
    } else if (event.properties.category === "Sea and Lake Ice") {
      return <GiFrozenBlock className={"marker-icon sea-and-lake-ice"} />;
    } else if (event.properties.category === "Severe Storms") {
      return <WiStormShowers className={"marker-icon severe-storm"} />;
    } else if (event.properties.category === "Snow") {
      return <WiSnow className={"marker-icon snow"} />;
    } else if (event.properties.category === "Temperature Extremes") {
      return (
        <WiThermometerExterior className={"marker-icon temperature-extreme"} />
      );
    } else if (event.properties.category === "Volcanoes") {
      return <WiVolcano className={"marker-icon volcano"} />;
    } else if (event.properties.category === "Water Color") {
      return <BiWater className={"marker-icon water-color"} />;
    } else if (event.properties.category === "Wildfires") {
      return <ImFire className={"marker-icon wildfire"} />;
    } else return null;
  };

  const toLocalDateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toUTCString();
  };

  const points = eventsData.map((event) => ({
    type: "Feature",
    properties: {
      cluster: false,
      eventId: event.id,
      category: event.categories[0].title,
      date: event.geometry[event.geometry.length - 1].date,
      eventTitle: event.title,
    },
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(event.geometry[event.geometry.length - 1].coordinates[0]),
        parseFloat(event.geometry[event.geometry.length - 1].coordinates[1]),
      ],
    },
  }));

  const bounds = mapRef.current
    ? mapRef.current.getMap().getBounds().toArray().flat()
    : null;

  const { clusters, supercluster } = useSupercluster({
    points,
    zoom: viewport.zoom,
    bounds,
    options: {
      radius: 80,
      maxZoom: 20,
    },
  });

  return (
    <>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_MAP_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/ortros/ckp76h4h52pyt18m7tbpdaz8u"
        onViewportChange={(viewport) => setViewport(viewport)}
        minZoom={2}
        maxZoom={20}
        ref={mapRef}
      >
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } =
            cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={cluster.id}
                latitude={latitude}
                longitude={longitude}
              >
                <div
                  className="cluster-marker"
                  style={{
                    width: `${2 + pointCount / points.length}vw`,
                    height: `${4 + pointCount / points.length}vh`,
                  }}
                  onClick={() => {
                    const expandZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      20
                    );
                    setViewport({
                      ...viewport,
                      longitude,
                      latitude,
                      zoom: expandZoom,
                      transitionInterpolator: new FlyToInterpolator({
                        speed: 0.6,
                      }),
                      transitionDuration: "auto",
                    });
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }

          return (
            <Marker
              key={cluster.properties.eventId}
              longitude={parseFloat(longitude)}
              latitude={parseFloat(latitude)}
            >
              <button
                className="marker-btn"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedEvent(cluster);
                }}
              >
                {assignIcon(cluster)}
              </button>
            </Marker>
          );
        })}

        {selectedEvent && (
          <Popup
            longitude={parseFloat(selectedEvent.geometry.coordinates[0])}
            latitude={parseFloat(selectedEvent.geometry.coordinates[1])}
            onClose={(e) => {
              setSelectedEvent(null);
            }}
            closeOnClick={false}
          >
            <h3>{selectedEvent.properties.eventTitle}</h3>
            <p>{toLocalDateFormat(selectedEvent.properties.date)}</p>
          </Popup>
        )}
      </ReactMapGL>
    </>
  );
};

export default Map;
