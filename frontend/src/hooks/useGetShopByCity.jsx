import { useEffect } from "react";
import { serverUrl } from "@/App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setShopsInCity } from "@/redux/userSlice";
const useGetShopByCity = () => {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchShopByCity = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/shop/get-by-city/${currentCity}`,
          {
            withCredentials: true,
          }
        );
        dispatch(setShopsInCity(result.data));
        console.log(result.data);
      } catch (error) {
        console.log(
          "Error fetching Shops in current city:",
          error.response?.data || error.message
        );
        dispatch(setShopsInCity(null));
      }
    };
    fetchShopByCity();
  }, [currentCity]);
};

export default useGetShopByCity;
