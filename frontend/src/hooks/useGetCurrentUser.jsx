import { serverUrl } from "@/App";
import axios from "axios";
import { useEffect } from "react";

const useGetCurrentUser = () => {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        console.log("Current user fetched successfully:", result.data);
      } catch (error) {
        console.log(
          "Error fetching current user:",
          error.response?.data || error.message
        );
        if (error.response?.status === 401) {
          console.log("User not authenticated");
        }
      }
    };
    fetchUser();
  }, []);
};

export default useGetCurrentUser;
