import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { MdMyLocation } from "react-icons/md";
import Nav from "@/components/Nav";
import { Input } from "@/components/ui/input";
import PaymentMethod from "@/components/PaymentMethod";
import OrderSummary from "@/components/OrderSummary";
import { MapContainer, Marker, TileLayer, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "@/redux/mapSlice";
import axios from "axios";
import { serverUrl } from "@/App";

const apiKey = import.meta.env.VITE_GEO_API_KEY;
const deliveryFee = 40;
// Component to animate map when location changes
const AnimateMap = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location?.lat && location?.lng) {
      map.setView([location.lat, location.lng], 16, { animate: true });
    }
  }, [location?.lat, location?.lng, map]);

  return null;
};

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { location, address } = useSelector((state) => state.map);
  const { cartItems, totalAmount } = useSelector((state) => state.user);
  const [inputAddress, setInputAddress] = useState(address || "");
  const [selectedPayment, setSelectedPayment] = useState("COD");

  useEffect(() => {
    if (address) {
      setInputAddress(address);
    }
  }, [address]);

  const defaultCenter = [23.0225, 72.5714]; // Ahmedabad coordinates

  const mapCenter = useMemo(() => {
    if (location?.lat && location?.lng) {
      return [location.lat, location.lng];
    }
    return defaultCenter;
  }, [location]);

  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, lng }));
    getAddressByLatLng(lat, lng);
  };

  const getAddressByLatLng = async (latitude, longitude) => {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
      );
      dispatch(setAddress(res.data.results[0].address_line2));
    } catch (error) {
      console.log(error);
    }
  };
  const getCurrentLocation = async () => {
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        dispatch(setLocation({ lat: latitude, lng: longitude }));
        getAddressByLatLng(latitude, longitude);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getLatLngByAddress = async (address) => {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          address
        )}&apiKey=${apiKey}`
      );
      const { lat, lon } = res.data.features[0].properties;
      dispatch(setLocation({ lat, lng: lon }));
      getAddressByLatLng(lat, lon);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/place-order`,
        {
          paymentMethod: selectedPayment,
          deliveryAddress: {
            text: inputAddress,
            latitude: location.lat,
            longitude: location.lng,
          },
          totalAmount: totalAmount + deliveryFee,
          cartItems: cartItems,
        },
        { withCredentials: true }
      );
      if (res.status === 201) navigate("/order-placed");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full min-h-screen bg-[#fff9f6] dark:bg-neutral-950">
      <Nav />
      <div className="mx-auto max-w-4xl px-4 py-6">
        <button
          type="button"
          className="flex items-center justify-center text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors mb-6"
          onClick={() => navigate(-1)}
        >
          <IoIosArrowRoundBack size={28} />
        </button>

        {/* Checkout Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Checkout
          </h2>

          {/* Delivery Location Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-amber-600 dark:text-amber-400" />
              <label className="text-base font-medium text-gray-900 dark:text-gray-100">
                Delivery Location
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Enter Your Delivery Address..."
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                className="flex-1 border-gray-300 dark:border-neutral-700 focus:border-amber-500 dark:focus:border-amber-500"
              />
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                aria-label="Search address"
                onClick={() => {
                  dispatch(setAddress(inputAddress));
                  getLatLngByAddress(inputAddress);
                }}
              >
                <FiSearch className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="cursor-pointer w-10 h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                aria-label="Use current location"
                onClick={getCurrentLocation}
              >
                <MdMyLocation className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-700">
              <div className="w-full h-64 rounded-lg">
                <MapContainer
                  center={mapCenter}
                  zoom={16}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "0.5rem",
                  }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <AnimateMap location={location} />
                  {location?.lat && location?.lng && (
                    <Marker
                      position={[location.lat, location.lng]}
                      draggable
                      eventHandlers={{ dragend: onDragEnd }}
                    >
                      <Popup>Your delivery location</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="mt-6">
            <PaymentMethod
              selectedPayment={selectedPayment}
              onPaymentSelect={setSelectedPayment}
            />
          </div>

          {/* Order Summary Section */}
          <div className="mt-6">
            <OrderSummary
              cartItems={cartItems}
              subtotal={totalAmount}
              deliveryFee={deliveryFee}
              total={totalAmount + deliveryFee}
            />
          </div>

          {/* Place Order Button */}
          <div className="mt-6">
            <button
              type="button"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
