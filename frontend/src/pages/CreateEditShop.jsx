import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaUtensils } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "@/App";
import { setMyShopData } from "@/redux/ownerSlice";

const VALIDATION_SCHEMA = Yup.object({
  name: Yup.string().required("Restaurant name is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  address: Yup.string().required("Address is required"),
});

const CreateEditShop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myShopData } = useSelector((state) => state.owner);
  const { currentCity, currentState, currentAddress } = useSelector(
    (state) => state.user
  );
  const [frontEndImg, setFrontEndImg] = useState(myShopData?.image || null);
  const INITIAL_VALUES = {
    name: myShopData?.name || "",
    image: myShopData?.image || null,
    city: myShopData?.city || currentCity,
    state: myShopData?.state || currentState,
    address: myShopData?.address || currentAddress,
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("city", values.city);
      formData.append("state", values.state);
      formData.append("address", values.address);
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      const { data, status, message } = await axios.post(
        `${serverUrl}/api/shop/create-edit`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (status === 201) {
        dispatch(setMyShopData(data));
        navigate("/");
      } else {
        console.log(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fff9f6]">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <button
          type="button"
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700"
          onClick={() => navigate(-1)}
        >
          <IoIosArrowRoundBack size={32} />
          <span className="font-medium">Back</span>
        </button>
      </div>

      <div className="mx-auto max-w-xl px-4 pb-10">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <FaUtensils size={22} />
            </div>
            <CardTitle className="text-center text-amber-600">
              {myShopData ? "Edit" : "Add"} Restaurant
            </CardTitle>
            <CardDescription className="text-center">
              Provide basic details to create your restaurant
            </CardDescription>
          </CardHeader>
          <Formik
            initialValues={INITIAL_VALUES}
            validationSchema={VALIDATION_SCHEMA}
            onSubmit={handleSubmit}
          >
            {({
              isSubmitting,
              setFieldValue,
              values,
              handleChange,
              handleBlur,
              errors,
              touched,
            }) => (
              <Form encType="multipart/form-data">
                <CardContent>
                  <div className="flex flex-col gap-5">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Restaurant Name</Label>
                      <Field
                        as={Input}
                        id="name"
                        name="name"
                        type="text"
                        className={
                          errors.name && touched.name ? "border-red-500" : ""
                        }
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="image">Shop Image</Label>
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0] || null;
                          console.log("file", file);
                          setFieldValue("image", file);
                          if (file) {
                            setFrontEndImg(URL.createObjectURL(file));
                          }
                          console.log("BE:", e.target.files[0]);
                        }}
                      />
                      <div className="text-xs text-gray-500">
                        JPG, PNG, or WEBP. Max 5MB.
                      </div>
                      <div>
                        {frontEndImg && (
                          <img
                            src={frontEndImg}
                            alt=""
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div className="grid gap-2">
                        <Label htmlFor="city">City</Label>
                        <Field
                          as={Input}
                          id="city"
                          name="city"
                          type="text"
                          className={
                            errors.city && touched.city ? "border-red-500" : ""
                          }
                          value={values.city}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="state">State</Label>
                        <Field
                          as={Input}
                          id="state"
                          name="state"
                          type="text"
                          className={
                            errors.state && touched.state
                              ? "border-red-500"
                              : ""
                          }
                          value={values.state}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          name="state"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address">Address</Label>
                      <Field
                        as={Input}
                        id="address"
                        name="address"
                        type="text"
                        className={
                          errors.address && touched.address
                            ? "border-red-500"
                            : ""
                        }
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end gap-3 mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Saving...
                      </span>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </CardFooter>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  );
};

export default CreateEditShop;
