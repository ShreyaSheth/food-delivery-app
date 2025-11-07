import { useEffect } from "react";
import { serverUrl } from "@/App";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setMyShopData } from "@/redux/ownerSlice";

const useGetMyShop = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/get-my-shop`, {
          withCredentials: true,
        });
        dispatch(setMyShopData(result.data));
      } catch (error) {
        console.log(
          "Error fetching current user:",
          error.response?.data || error.message
        );
        dispatch(setMyShopData(null));
      }
    };
    fetchShop();
  }, []);
};

export default useGetMyShop;
