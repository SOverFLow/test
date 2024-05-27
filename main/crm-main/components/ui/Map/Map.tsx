import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import { useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAddress } from "@/store/addressSlice";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
  }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

type MapProps = {
  latitude: number;
  longitude: number;
  height?: string;
};

type ChangeViewProps = {
  center: L.LatLngExpression;
};

const ChangeView: React.FC<ChangeViewProps> = ({ center }) => {
  const map = useMap();
  map.setView(center);
  return null;
};

const ClickListener = ({
  onClick,
}: {
  onClick: (e: L.LeafletMouseEvent) => void;
}) => {
  useMapEvents({
    click: onClick,
  });

  return null;
};

const Map: React.FC<MapProps> = ({ latitude, longitude, height }) => {
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<L.LatLngExpression>([
    latitude,
    longitude,
  ]);
  const [viewport, setViewport] = useState({
    latitude: latitude,
    longitude: longitude,
    zoom: 20,
  });

  const customIcon = new L.Icon({
    iconUrl: "/placeholder.png",
    iconSize: [38, 38],
  });

  useEffect(() => {
    setIsMounted(true);
    setViewport((prevViewport) => ({
      ...prevViewport,
      latitude: latitude,
      longitude: longitude,
    }));
    setMarkerPosition([latitude, longitude]);
  }, [latitude, longitude]);

  if (!isMounted) {
    return null;
  }

  const MapEventLayer = () => {
    useMapEvents({
      click(e) {
        setMarkerPosition(e.latlng);
      },
    });
    return null;
  };

  const handleMapClick = async (event: L.LeafletMouseEvent) => {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;

    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      );
      const address =
        response.data.features.length > 0
          ? response.data.features[0].place_name
          : "Address not found";
      dispatch(setAddress(address));
    } catch (error) {
      console.log("Error during reverse geocoding with Mapbox:", error);
    }
  };

  return (
    isMounted && (
      <>
        <MapContainer
          center={markerPosition}
          zoom={viewport.zoom}
          scrollWheelZoom={true}
          style={{ height: height ? height : "70%", width: "100%" }}
        >
          <MapEventLayer />
          <ClickListener onClick={handleMapClick} />
          <ChangeView center={markerPosition} />
          <TileLayer
            attribution='&copy; <a href=""></a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={markerPosition} icon={customIcon}>
            <Popup>
              Hello from <br /> {latitude}, {longitude}
            </Popup>
          </Marker>
        </MapContainer>
      </>
    )
  );
};

export default Map;
