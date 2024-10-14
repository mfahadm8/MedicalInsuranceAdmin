import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/shared/button";
import { PasswordInput } from "@/components/shared/password-input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/utilities/AuthProvider";
import { Card } from "@/components/ui/card";
import {
  fetchAuthSession,
  fetchUserAttributes,
  signIn,
  signOut,
} from "aws-amplify/auth";
import { sendUserAttributeVerificationCode } from "aws-amplify/auth";
import { ForgotForm } from "./update-form";
import { VerifyForm } from "./verify-form";
import { toast } from "@/components/ui/use-toast";

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, {
      message: "Please enter your password",
    })
    .min(7, {
      message: "Password must be at least 7 characters long",
    }),
});

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [nextStep, setNextStep] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const { login } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleFetchUserAttributes() {
    try {
      const userAttributes = await fetchUserAttributes();
      return userAttributes;
    } catch (error) {
      console.log(error);
    }
  }
  async function handleSendUserAttributeVerificationCode(key: any) {
    try {
      const data = await sendUserAttributeVerificationCode({
        userAttributeKey: key,
      });
      if (data) {
        setShowVerify(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const SignIn = async (username: string, password: string) => {
    try {
      // Call Amplify's signIn function
      const { isSignedIn, nextStep } = await signIn({ username, password });

      if (
        nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        setNextStep(true);
      }

      if (isSignedIn) {
        const userAttributes = await handleFetchUserAttributes();
        async function currentSession() {
          try {
            const { idToken } = (await fetchAuthSession()).tokens ?? {};
            idToken && login(idToken);
            toast({
              title: "Logged in successfully.",
              duration: 2000,
              variant: "success",
            });
            setIsLoading(false);
          } catch (err: any) {
            toast({
              title: err?.massage || "Something went wrong please try again.",
              duration: 2000,
              variant: "destructive",
            });
            setIsLoading(false);
          }
        }
        if (userAttributes && userAttributes?.email_verified) {
          await currentSession();
        } else {
          handleSendUserAttributeVerificationCode("email");
        }
      }
    } catch (error: any) {
      if (error?.message === "There is already a signed in user.") {
        localStorage.clear();
        await signOut();
        window.location.reload();
      } else {
        console.error("Sign-in error:", error);
        setIsLoading(false);
        toast({
          title: error?.message || "Something went wrong please try again.",
          duration: 2000,
          variant: "destructive",
        });
      }
    }
  };

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    SignIn(data.email, data.password);
  }
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {!resetPassword && !nextStep && !showVerify && (
        <Card className=" shadow-sm rounded-[32px] border p-6 ">
          {/* <h2 className="font-22 mb-2 font-semibold text-foreground">Login</h2>
          <p className="font-16 mb-4 text-muted-foreground">
           </p> */}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-foreground">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name@example.com"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-foreground mb-1 mt-4">
                          Password
                        </FormLabel>
                      </div>
                      <FormControl>
                        <PasswordInput
                          placeholder="********"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium   text-foreground text-end mt-2"
                >
                  Forgot your password?
                </Link>
                <Button className="mt-2 h-12 " loading={isLoading}>
                  <p className="font-20 font-normal">Login</p>
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      )}

      {nextStep && !showVerify && <ForgotForm />}

      {showVerify && <VerifyForm />}
    </div>
  );
}
