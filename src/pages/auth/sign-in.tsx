import { UserAuthForm } from "./components/user-auth-form";
import Logo from "@/assets/Logo.svg";
import LogoLight from "@/assets/LogoLight.svg";
import { ThemeProvider } from "@/components/utilities/ThemeProvider";
import { AuthContextProvider } from "@/components/utilities/AuthProvider";
import { useTheme } from "@/components/utilities/ThemeProvider";
import "./auth.scss";
export default function SignIn() {
  const { theme } = useTheme();
  return (
    <ThemeProvider>
      <AuthContextProvider>
        <div className="container relative   h-svh flex  items-center justify-center lg:max-w-none   login p-6">
          <div className="relative hidden h-full flex-col   p-10 text-white  lg:flex md:w-[57%]">
            <img
              src={LogoLight}
              alt=""
              width={240}
              className="relative -top-10"
            />
          </div>
          <div className=" w-full md:w-[43%] bg-white h-full m-auto flex items-center  rounded-[30px]">
            <div className="mx-auto  flex w-full flex-col justify-center  space-y-2 sm:w-[350px] md:w-[454px]">
              <div className="flex flex-col space-y-2 text-left items-center">
                <div className="flex flex-col justify-center items-center text-foreground">
                  <img src={Logo} alt="" width={240} className="mb-4" />
                </div>

                <h1 className="font-36 font-bold tracking-tight text-center  pb-6 text-foreground pt-5">
                  Sign In To Continue
                </h1>
              </div>
              <UserAuthForm />
            </div>
          </div>
        </div>
      </AuthContextProvider>
    </ThemeProvider>
  );
}
