import { serverUrl } from "@/App";
import axios from "axios";
import React, { useMemo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
import { setMyShopData } from "@/redux/ownerSlice";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaUtensils } from "react-icons/fa";

const ImagePreview = ({ file, fallbackUrl }) => {
  const objectUrl = useMemo(() => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return null;
  }, [file]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const src =
    objectUrl ?? (typeof fallbackUrl === "string" ? fallbackUrl : null);
  if (!src) return null;

  return (
    <img
      src={src}
      alt=""
      className="w-full h-48 object-cover rounded-lg border"
    />
  );
};

const ItemCategory = Object.freeze({
  SNACKS: "Snacks",
  MAIN_COURSE: "Main Course",
  APPETIZERS: "Appetizers",
  SOUPS: "Soups",
  SMOOTHIES: "Smoothies",
  NORTH_INDIAN: "North Indian",
  SOUTH_INDIAN: "South Indian",
  CHINESE: "Chinese",
  FAST_FOOD: "Fast Food",
  MEXICAN: "Mexican",
  RICE_BIRYANIS: "Rice/Biryanis",
  VEGAN: "Vegan",
  DRINKS: "Drinks",
  BEVERAGES: "Beverages",
  DESSERTS: "Desserts",
  OTHER: "Other",
});

const CATEGORY_OPTIONS = Object.values(ItemCategory);
const FOOD_TYPES = ["veg", "non-veg"];
const VALIDATION_SCHEMA = Yup.object({
  name: Yup.string().required("Item name is required"),
  category: Yup.string().required("Category is required"),
  price: Yup.number().required("Price is required"),
  foodType: Yup.string().required("Food type is required"),
});
const INITIAL_VALUES = {
  name: "",
  image: null,
  foodType: "veg",
  category: "",
  price: "",
};
const EditItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const [formData, setFormData] = useState(INITIAL_VALUES);
  const [loading, setLoading] = useState(true);

  const handleGetItemById = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`, {
        withCredentials: true,
      });
      console.log("res.data", res.data);
      setFormData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleGetItemById();
  }, [itemId]);
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("price", values.price);
      formData.append("foodType", values.foodType);
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      const { data, status, message } = await axios.post(
        `${serverUrl}/api/item/edit-item/${itemId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (status === 200) {
        dispatch(setMyShopData(data));
        navigate("/");
      } else {
        console.log(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#fff9f6] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] dark:bg-neutral-950">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <button
          type="button"
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
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
            <CardTitle className="text-center text-amber-600 dark:text-amber-400">
              Edit Item
            </CardTitle>
            <CardDescription className="text-center">
              Provide details to add your menu item
            </CardDescription>
          </CardHeader>
          <Formik
            initialValues={formData}
            validationSchema={VALIDATION_SCHEMA}
            enableReinitialize
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
                {console.log("values", values)}
                <CardContent>
                  <div className="flex flex-col gap-5">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Item Name</Label>
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
                      <Label htmlFor="image">Item Image</Label>
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0] || null;
                          setFieldValue("image", file);
                        }}
                      />
                      <div className="text-xs text-gray-500">
                        JPG, PNG, or WEBP. Max 5MB.
                      </div>
                      <div>
                        <ImagePreview
                          file={values.image}
                          fallbackUrl={formData?.image || null}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Field
                          as="select"
                          id="category"
                          name="category"
                          className={`border rounded-md h-10 px-3 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 dark:border-neutral-700 ${
                            errors.category && touched.category
                              ? "border-red-500"
                              : ""
                          }`}
                          value={values.category}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="">Select category</option>
                          {CATEGORY_OPTIONS.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="category"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="foodType">Food Type</Label>
                        <Field
                          as="select"
                          id="foodType"
                          name="foodType"
                          className={`border rounded-md h-10 px-3 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 dark:border-neutral-700 ${
                            errors.foodType && touched.foodType
                              ? "border-red-500"
                              : ""
                          }`}
                          value={values.foodType}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          {FOOD_TYPES.map((ft) => (
                            <option key={ft} value={ft}>
                              {ft}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="foodType"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="price">Price</Label>
                      <Field
                        as={Input}
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        className={
                          errors.price && touched.price ? "border-red-500" : ""
                        }
                        value={values.price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="price"
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
                    onClick={() => navigate("/")}
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

export default EditItem;
