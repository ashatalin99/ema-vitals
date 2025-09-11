"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { username, password, rememberMe });
    // Handle login logic here
  };

  return (
    <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-[40px] font-bold text-medical-red mb-8 flex items-center justify-center gap-2">
            ema
            <Image src="/ema-logo.png" alt="ema logo" width={32} height={32} />
            telemed
          </h1>
        </div>
        <Card className="bg-medical-dark-lighter border-0">
          <CardHeader className="space-y-1 pb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-medical-red rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-medical-red-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute left-0 top-0 h-10 w-12 bg-medical-red rounded-l-md flex items-center justify-center">
                    <User className="w-4 h-4 text-medical-red-foreground" />
                  </div>
                  <Input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-14 bg-background border-0 text-foreground placeholder:text-medical-gray focus:border-medical-red focus:ring-medical-red"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute left-0 top-0 h-10 w-12 bg-medical-red rounded-l-md flex items-center justify-center">
                    <Lock className="w-4 h-4 text-medical-red-foreground" />
                  </div>
                  <Input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-14 bg-background border-0 text-foreground placeholder:text-medical-gray focus:border-medical-red focus:ring-medical-red"
                    required
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-medical-red data-[state=checked]:bg-medical-red data-[state=checked]:border-medical-red"
                />
                <Label 
                  htmlFor="remember" 
                  className="text-medical-red text-sm font-medium cursor-pointer"
                >
                  Remember Me
                </Label>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                variant="medical"
                size="lg"
                className="w-full h-12 text-base"
                onClick={() => router.push('/devices')}
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
  );
};

export default LoginForm;