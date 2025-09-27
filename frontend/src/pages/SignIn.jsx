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
import { useNavigate } from "react-router-dom";
const SignIn = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
              className="text-amber-600"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
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
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" onClick={handleSignIn}>
            Sign In
          </Button>
          <Button variant="outline" className="w-full">
            <FcGoogle /> Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
