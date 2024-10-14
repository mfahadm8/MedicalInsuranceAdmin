import { Card } from "@/components/ui/card";
import { ForgotForm } from "./components/update-form";
import { Link } from "react-router-dom";
import { AuthContextProvider } from "@/components/utilities/AuthProvider";
import Logo from "@/assets/Logo.svg";
import "./auth.scss";

export default function ForgotPassword() {
  return (
    <AuthContextProvider>
      <div className="container relative   h-svh flex  items-center justify-center lg:max-w-none  lg:px-0">
        <div className="relative hidden h-full flex-col p-10 text-white   lg:flex md:w-[38%]">
          <div className="absolute inset-0 forget" />

          <div className="relative z-20 mt-auto"></div>
        </div>
        <div className="w-full lg:p-8 lg:pt-0 md:w-[62%]">
          <div className="mx-auto flex w-full flex-col justify-center space-y-2 md:w-[454px]">
            <div className="flex flex-col space-y-2 text-left">
              <img
                src={Logo}
                alt=""
                width={268}
                height={78}
                className="mx-auto"
              />

              <p className="font-20 font-normal text-foreground text-center pt-2 pb-6 ">
                Safety Management System{" "}
              </p>
            </div>
            <ForgotForm />
          </div>
        </div>
      </div>
    </AuthContextProvider>
  );
}
