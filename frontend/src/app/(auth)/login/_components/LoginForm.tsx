"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/logo.png";
import { Eye, Mail, Lock, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "../../_schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";


export default function LoginForm() {
  const[showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting}
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }

  });

  const onSubmit = (data: LoginFormData) => {
    alert(`Email: ${data.email}, password: ${data.password}`);
    // later replace alert with API call
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src={logo}
            alt="RentExpress Logo"
            width={180}
            height={100}
          />
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h3>Welcome Back!!!</h3>
          <p className="text-gray-500 mt-1">
            Login to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium">
              Email Address
            </label>

            <div className="flex items-center border rounded-lg px-3 py-3  border-gray-400 focus-within:border-cyan-500">
              <Mail className="text-gray-400 mr-2" size={20} />

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full outline-none"
                {...register("email")}
              />
            </div>
             {errors.email &&
              (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <div className="flex items-center border rounded-lg px-3 py-3 border-gray-400 focus-within:border-cyan-500">
              <Lock className="text-gray-400 mr-2" size={20} />

              <input
                type="password"
                placeholder="Enter your password"
                className="w-full outline-none"
                {...register("password")}
              />
              <div onClick={()=> setShowPassword(!showPassword)}>
                {showPassword
                 ? <EyeOff className="text-gray-400 cursor-pointer" size={20} />
                 : <Eye className="text-gray-400 cursor-pointer" size={20} />
                }
              </div>
            </div>
            {errors.password && 
            (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold transition"
          >
            {isSubmitting ? "Logging in...": "login"}
          </button>
        </form>

        {/* Register */}
        <p className="text-center mt-6">
          Don’t have an account?<Link href="/register"><span className="text-cyan-500 font-semibold hover:underline cursor-pointer">
            Register
          </span>
          </Link>
        
        </p>

      </div>
    </div>
  );
}