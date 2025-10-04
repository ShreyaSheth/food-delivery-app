import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState("");

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
          <form>
            {step === 1 && (
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email"
                    required
                  />
                </div>
                <Button className="cursor-pointer" onClick={() => setStep(2)}>
                  Send OTP
                </Button>
              </div>
            )}
            {step === 2 && (
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">OTP</Label>
                  <Input
                    id="otp"
                    type="email"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter your OTP"
                    required
                  />
                </div>
                <Button className="cursor-pointer" onClick={() => setStep(3)}>
                  Verify OTP
                </Button>
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-col gap-6">
                <div className="grid gap-2 relative">
                  <Label htmlFor="password">New Password</Label>
                  <div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your Password"
                      required
                    />
                    <Button
                      variant="transey"
                      className={
                        "absolute right-3 top-5 text-gray-500 cursor-pointer"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2 relative">
                  <Label htmlFor="password">Confirm Password</Label>
                  <div>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Enter your Password"
                      required
                    />
                    <Button
                      variant="transey"
                      className={
                        "absolute right-3 top-5 text-gray-500 cursor-pointer"
                      }
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </Button>
                  </div>
                </div>
                <Button className="cursor-pointer">Reset Password</Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
