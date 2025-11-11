import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
} from "@/redux/userSlice";

const useGetCity = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const apiKey = import.meta.env.VITE_GEO_API_KEY;
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
      );
      console.log(res.data.results[0]);
      dispatch(setCurrentCity(res.data.results[0].city));
      dispatch(setCurrentState(res.data.results[0].state));
      dispatch(
        setCurrentAddress(
          res.data.results[0].address_line2 || res.data.results[0].address_line1
        )
      );
    });
  }, [userData]);
};

export default useGetCity;
