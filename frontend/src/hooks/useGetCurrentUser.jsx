import { useEffect } from "react";
import { serverUrl } from "@/App";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "@/redux/userSlice";
const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log(
          "Error fetching current user:",
          error.response?.data || error.message
        );
        dispatch(setUserData(null));
      }
    };
    fetchUser();
  }, []);
};

export default useGetCurrentUser;
