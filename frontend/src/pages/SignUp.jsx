import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "@/App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";

const INITIAL_VALUES = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  password: "",
  role: "user",
};

const VALIDATION_SCHEMA = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
    .required("Mobile number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include one uppercase, one lowercase, one number, and one special character"
    )
    .required("Password is required"),
  role: Yup.string()
    .oneOf(["user", "owner", "deliveryBoy"], "Please select a valid role")
    .required("Role is required"),
});

const MOBILE_VALIDATION_SCHEMA = Yup.object({
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
    .required("Mobile number is required"),
});

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showMobileDialog, setShowMobileDialog] = useState(false);
  const [tempMobile, setTempMobile] = useState("");

  const handleSignUp = async (values, { setSubmitting }) => {
    try {
      console.log(values);
      const res = await axios.post(`${serverUrl}/api/auth/signup`, values, {
        withCredentials: true,
      });
      console.log("Signup successful:", res.data);
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = async (mobile = null) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      const userData = {
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ")[1] || "",
        email: user.email,
        mobile: mobile || tempMobile,
        role: "user",
      };

      console.log("Google auth successful:", userData);

      const res = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        userData,
        {
          withCredentials: true,
        }
      );
      console.log("Backend signup successful:", res.data);
    } catch (error) {
      console.error("Google auth error:", error);
      setShowMobileDialog(false);
    }
  };

  const handleGoogleSignUpClick = () => {
    // Check if mobile is already entered in the form
    const formMobile = document.querySelector('input[name="mobile"]')?.value;

    if (formMobile && formMobile.length === 10) {
      // Mobile is available, proceed with Google auth
      handleGoogleAuth(formMobile);
    } else {
      // Mobile not available, show dialog
      setShowMobileDialog(true);
    }
  };

  const handleMobileDialogSubmit = async (values, { setSubmitting }) => {
    try {
      setTempMobile(values.mobile);
      setShowMobileDialog(false);
      await handleGoogleAuth(values.mobile);
    } catch (error) {
      console.error("Mobile dialog error:", error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-lg gap-4">
        <CardHeader>
          <CardTitle className="text-amber-600 text-lg">Craveo</CardTitle>
          <CardDescription>
            Create your account to get started with delicious food deliveries
          </CardDescription>
          <CardAction>
            <Button
              variant="link"
              className="text-amber-600"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </Button>
          </CardAction>
        </CardHeader>
        <Formik
          initialValues={INITIAL_VALUES}
          validationSchema={VALIDATION_SCHEMA}
          onSubmit={handleSignUp}
        >
          {({
            isSubmitting,
            values,
            handleChange,
            handleBlur,
            errors,
            touched,
            setFieldValue,
          }) => (
            <>
              <CardContent>
                <Form>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                      <div className="flex-col flex-1">
                        <Label className="mb-2">First Name</Label>
                        <Field
                          as={Input}
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="First Name"
                          className={
                            errors.firstName && touched.firstName
                              ? "border-red-500"
                              : ""
                          }
                          required
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div className="flex-col flex-1">
                        <Label className="mb-2">Last Name</Label>
                        <Field
                          as={Input}
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Last Name"
                          className={
                            errors.lastName && touched.lastName
                              ? "border-red-500"
                              : ""
                          }
                          required
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your Email"
                        className={
                          errors.email && touched.email ? "border-red-500" : ""
                        }
                        required
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Mobile</Label>
                      <Field
                        as={Input}
                        id="mobile"
                        name="mobile"
                        type="text"
                        value={values.mobile}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your mobile number"
                        className={
                          errors.mobile && touched.mobile
                            ? "border-red-500"
                            : ""
                        }
                        required
                      />
                      <ErrorMessage
                        name="mobile"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="grid gap-2 relative">
                      <Label htmlFor="password">Password</Label>
                      <div>
                        <Field
                          as={Input}
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your Password"
                          className={
                            errors.password && touched.password
                              ? "border-red-500"
                              : ""
                          }
                          required
                        />
                        <Button
                          type="button"
                          variant="transey"
                          className={
                            "absolute right-3 top-5 text-gray-500 cursor-pointer"
                          }
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                        </Button>
                      </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Role</Label>
                      <div className="relative flex gap-2">
                        {["user", "owner", "deliveryBoy"].map((item) => (
                          <Button
                            key={item}
                            type="button"
                            onClick={() => setFieldValue("role", item)}
                            className="flex-1 transition-colors cursor-pointer"
                            variant={
                              values.role === item ? "craveo" : "outline"
                            }
                          >
                            {item.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                      <ErrorMessage
                        name="role"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <ClipLoader size={16} color="#ffffff" />
                          Signing Up...
                        </div>
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </div>
                </Form>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={handleGoogleSignUpClick}
                >
                  <FcGoogle /> Sign Up with Google
                </Button>
              </CardFooter>
            </>
          )}
        </Formik>
        <Dialog open={showMobileDialog} onOpenChange={setShowMobileDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-amber-600">
                Mobile Number Required
              </DialogTitle>
              <DialogDescription>
                Please enter your mobile number to continue with Google Sign Up.
                This is required for account verification.
              </DialogDescription>
            </DialogHeader>
            <Formik
              initialValues={{ mobile: "" }}
              validationSchema={MOBILE_VALIDATION_SCHEMA}
              onSubmit={handleMobileDialogSubmit}
            >
              {({
                isSubmitting,
                values,
                handleChange,
                handleBlur,
                errors,
                touched,
              }) => (
                <Form>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="dialogMobile">Mobile Number</Label>
                      <Field
                        as={Input}
                        id="dialogMobile"
                        name="mobile"
                        type="text"
                        value={values.mobile}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your mobile number"
                        className={
                          errors.mobile && touched.mobile
                            ? "border-red-500"
                            : ""
                        }
                      />
                      <ErrorMessage
                        name="mobile"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowMobileDialog(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="cursor-pointer"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <ClipLoader size={16} color="#ffffff" />
                          Continuing...
                        </div>
                      ) : (
                        "Continue with Google"
                      )}
                    </Button>
                  </DialogFooter>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default SignUp;
