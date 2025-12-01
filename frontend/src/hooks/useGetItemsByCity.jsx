import { useEffect } from "react";
import { serverUrl } from "@/App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setItemsInCity } from "@/redux/userSlice";
const useGetItemsByCity = () => {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchItemsByCity = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/item/get-by-city/${currentCity}`,
          {
            withCredentials: true,
          }
        );
        dispatch(setItemsInCity(result.data));
        console.log(result.data);
      } catch (error) {
        console.log(
          "Error fetching Shops in current city:",
          error.response?.data || error.message
        );
        dispatch(setItemsInCity(null));
      }
    };
    fetchItemsByCity();
  }, [currentCity]);
};

export default useGetItemsByCity;
