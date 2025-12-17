import { useEffect } from "react";
import { serverUrl } from "@/App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders } from "@/redux/userSlice";

const useGetMyOrders = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/order/get-my-orders`, {
          withCredentials: true,
        });
        console.log("My Orders", result.data);
        dispatch(setMyOrders(result.data));
      } catch (error) {
        console.log(
          "Error fetching current user:",
          error.response?.data || error.message
        );
        dispatch(setMyOrders(null));
      }
    };
    fetchMyOrders();
  }, [userData]);
};

export default useGetMyOrders;
