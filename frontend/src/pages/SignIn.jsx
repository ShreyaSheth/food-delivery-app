import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { serverUrl } from "@/App";
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
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { setUserData } from "@/redux/userSlice";

const INITIAL_VALUES = {
  email: "",
  password: "",
};

const VALIDATION_SCHEMA = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include one uppercase, one lowercase, one number, and one special character"
    )
    .required("Password is required"),
});

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post(`${serverUrl}/api/auth/signin`, values, {
        withCredentials: true,
      });
      dispatch(setUserData(res.data));
    } catch (error) {
      console.error("SignIn error:", error.response?.data || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      const userData = {
        email: user.email,
      };

      const res = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        userData,
        {
          withCredentials: true,
        }
      );
      dispatch(setUserData(res.data));
    } catch (error) {
      console.error("Google auth error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-amber-600 text-lg">Craveo</CardTitle>
          <CardDescription>
            Sign in your account to get delicious food deliveries
          </CardDescription>
          <CardAction>
            <Button
              variant="link"
              className="text-amber-600 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>
        <Formik
          initialValues={INITIAL_VALUES}
          validationSchema={VALIDATION_SCHEMA}
          onSubmit={handleSignIn}
        >
          {({
            isSubmitting,
            values,
            handleChange,
            handleBlur,
            errors,
            touched,
          }) => (
            <>
              <CardContent>
                <Form>
                  <div className="flex flex-col gap-4">
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
                      <div
                        className="text-right mb-2 text-amber-600 cursor-pointer"
                        onClick={() => navigate("/forgot-password")}
                      >
                        Forgot Password?
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <ClipLoader size={16} color="#ffffff" />
                          Signing In...
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </div>
                </Form>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={handleGoogleAuth}
                >
                  <FcGoogle /> Sign In with Google
                </Button>
              </CardFooter>
            </>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default SignIn;
