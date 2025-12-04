import { useEffect } from "react";
import { serverUrl } from "@/App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "@/redux/ownerSlice";

const useGetMyShop = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
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
  }, [userData]);
};

export default useGetMyShop;
