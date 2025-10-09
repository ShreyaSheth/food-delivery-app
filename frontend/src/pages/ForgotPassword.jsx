import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { serverUrl } from "@/App";

const STEP1_INITIAL_VALUES = {
  email: "",
};

const STEP2_INITIAL_VALUES = {
  otp: "",
};

const STEP3_INITIAL_VALUES = {
  newPassword: "",
  confirmPassword: "",
};

const STEP1_VALIDATION_SCHEMA = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

const STEP2_VALIDATION_SCHEMA = Yup.object({
  otp: Yup.string()
    .matches(/^[0-9]{4}$/, "OTP must be exactly 4 digits")
    .required("OTP is required"),
});

const STEP3_VALIDATION_SCHEMA = Yup.object({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include one uppercase, one lowercase, one number, and one special character"
    )
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSetOtp = async (values, { setSubmitting }) => {
    try {
      console.log(values);
      const res = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email: values.email },
        { withCredentials: true }
      );
      console.log("OTP sent successfully:", res.data);
      setEmail(values.email);
      setStep(2);
    } catch (error) {
      console.error(
        "Error sending OTP:",
        error.response?.data || error.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (values, { setSubmitting }) => {
    try {
      console.log(values);
      const res = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp: values.otp },
        { withCredentials: true }
      );
      console.log("OTP verified successfully:", res.data);
      setStep(3);
    } catch (error) {
      console.error(
        "Error verifying OTP:",
        error.response?.data || error.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (values, { setSubmitting }) => {
    try {
      console.log(values);
      const res = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, newPassword: values.newPassword },
        { withCredentials: true }
      );
      console.log("Password reset successfully:", res.data);
      navigate("/signin");
    } catch (error) {
      console.error(
        "Error resetting password:",
        error.response?.data || error.message
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-amber-600 text-lg flex items-center gap-4">
            <IoIosArrowRoundBack
              size={30}
              className="text-amber-600 cursor-pointer"
              onClick={() => navigate("/signin")}
            />
            <h1>Forgot Password</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <Formik
              initialValues={STEP1_INITIAL_VALUES}
              validationSchema={STEP1_VALIDATION_SCHEMA}
              onSubmit={handleSetOtp}
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
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="cursor-pointer"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <ClipLoader size={16} color="#ffffff" />
                          Sending OTP...
                        </div>
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
          {step === 2 && (
            <Formik
              initialValues={STEP2_INITIAL_VALUES}
              validationSchema={STEP2_VALIDATION_SCHEMA}
              onSubmit={handleVerifyOtp}
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
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="otp">OTP</Label>
                      <Field
                        as={Input}
                        id="otp"
                        name="otp"
                        type="text"
                        value={values.otp}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your OTP"
                        className={
                          errors.otp && touched.otp ? "border-red-500" : ""
                        }
                      />
                      <ErrorMessage
                        name="otp"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="cursor-pointer"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <ClipLoader size={16} color="#ffffff" />
                          Verifying OTP...
                        </div>
                      ) : (
                        "Verify OTP"
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
          {step === 3 && (
            <Formik
              initialValues={STEP3_INITIAL_VALUES}
              validationSchema={STEP3_VALIDATION_SCHEMA}
              onSubmit={handleResetPassword}
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
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-2 relative">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div>
                        <Field
                          as={Input}
                          id="newPassword"
                          name="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={values.newPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your Password"
                          className={
                            errors.newPassword && touched.newPassword
                              ? "border-red-500"
                              : ""
                          }
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
                        name="newPassword"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="grid gap-2 relative">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div>
                        <Field
                          as={Input}
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Confirm your Password"
                          className={
                            errors.confirmPassword && touched.confirmPassword
                              ? "border-red-500"
                              : ""
                          }
                        />
                        <Button
                          type="button"
                          variant="transey"
                          className={
                            "absolute right-3 top-5 text-gray-500 cursor-pointer"
                          }
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                        >
                          {showConfirmPassword ? (
                            <FaRegEye />
                          ) : (
                            <FaRegEyeSlash />
                          )}
                        </Button>
                      </div>
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="cursor-pointer"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <ClipLoader size={16} color="#ffffff" />
                          Resetting Password...
                        </div>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
