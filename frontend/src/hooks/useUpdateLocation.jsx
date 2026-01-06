import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "@/App";

const useUpdateLocation = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const updateLocation = async (latitude, longitude) => {
      const res = await axios.post(
        `${serverUrl}/api/user/update-location`,
        {
          latitude,
          longitude,
        },
        { withCredentials: true }
      );
    };
    navigator.geolocation.watchPosition((position) => {
      updateLocation(position.coords.latitude, position.coords.longitude);
    });
  }, [userData]);
};

export default useUpdateLocation;
