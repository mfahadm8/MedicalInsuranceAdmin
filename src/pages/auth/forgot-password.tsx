import { Card } from "@/components/ui/card";
import { ForgotForm } from "./components/forgot-form";
import { Link } from "react-router-dom";
import { AuthContextProvider } from "@/components/utilities/AuthProvider";
import "./auth.scss";
import Logo from "@/assets/Logo.svg";
import LogoDark from "@/assets/NavLogo.svg";
import { useTheme } from "@/components/utilities/ThemeProvider";
export default function ForgotPassword() {
  const { theme } = useTheme();

  return (
    <AuthContextProvider>
      <div className="container relative   h-svh flex  items-center justify-center lg:max-w-none  lg:px-0">
        <div className="relative hidden h-full flex-col p-10 text-white  lg:flex md:w-[38%]">
          <div className="absolute inset-0 forget" />

          <div className="relative z-20 mt-auto"></div>
        </div>
        <div className="lg:p-8 lg:pt-0 md:w-[62%]">
          <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px] md:w-[454px]">
            <div className="flex flex-col space-y-2 text-left">
              <div className="flex justify-center">
                {theme === "dark" ? (
                  <img src={LogoDark} alt="" width={240} className="mb-4" />
                ) : (
                  <img src={Logo} alt="" />
                )}
              </div>

              <p className="font-20 font-normal text-foreground text-center pt-2 pb-6 ">
                Safety Management System{" "}
              </p>

              {/* <h1 className="font-36 font-bold tracking-tight text-center  pb-6 text-foreground ">
                Resume Your Account Access{" "}
              </h1> */}
            </div>
            <ForgotForm />
          </div>
        </div>
      </div>
    </AuthContextProvider>
  );
}
