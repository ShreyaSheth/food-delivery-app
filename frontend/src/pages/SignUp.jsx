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
import { FcGoogle } from "react-icons/fc";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "@/App";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const values = { firstName, lastName, email, password, mobile, role };
      const res = await axios.post(`${serverUrl}/api/auth/signup`, values, {
        withCredentials: true,
      });
      console.log("Signup successful:", res.data);
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-lg">
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
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="flex gap-2">
                <div className="flex-col">
                  <Label className="mb-2">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="flex-col">
                  <Label className="mb-2">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>
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
              <div className="grid gap-2">
                <Label>Mobile</Label>
                <Input
                  id="mobile"
                  type="number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
              <div className="grid gap-2 relative">
                <Label htmlFor="password">Password</Label>
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
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <div className="relative flex gap-2">
                  {["user", "owner", "deliveryBoy"].map((item) => (
                    <Button
                      key={item}
                      type="button"
                      onClick={() => setRole(item)}
                      className="flex-1 transition-colors cursor-pointer"
                      variant={role === item ? "craveo" : "outline"}
                    >
                      {item.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button variant="outline" className="w-full">
            <FcGoogle /> Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
