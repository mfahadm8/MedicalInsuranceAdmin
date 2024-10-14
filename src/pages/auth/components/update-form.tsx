import { HTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/shared/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PasswordInput } from "@/components/shared/password-input";
import {
  confirmSignIn,
  sendUserAttributeVerificationCode,
} from "aws-amplify/auth";
import { VerifyForm } from "./verify-form";
import { toast } from "@/components/ui/use-toast";
interface ForgotFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z
  .object({
    password: z
      .string()
      .min(1, {
        message: "Please enter your password",
      })
      .min(7, {
        message: "Password must be at least 7 characters long",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export function ForgotForm({ className, ...props }: ForgotFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const handleResetPassword = async (newPassword: string) => {
    try {
      const { isSignedIn } = await confirmSignIn({
        challengeResponse: newPassword,
      });

      if (isSignedIn) {
        async function handleSendUserAttributeVerificationCode(key: any) {
          try {
            const data = await sendUserAttributeVerificationCode({
              userAttributeKey: key,
            });
            if (data) {
              setIsLoading(false);
              setShowVerify(true);
            }
          } catch (error) {
            console.log(error);
          }
        }
        handleSendUserAttributeVerificationCode("email");
      }
    } catch (error: any) {
      toast({
        title: error?.message || "An error occurred.",
        duration: 2000,
        variant: "destructive",
      });
    }
  };
  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(data);
    handleResetPassword(data.confirmPassword);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {!showVerify && (
        <Card className=" shadow-none rounded-md border-0">
          <h2 className="font-36 mb-4 font-semibold text-foreground">
            Reset your password
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-foreground">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="New Password"
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-foreground mb-1 mt-4">
                          Confirm Password
                        </FormLabel>
                      </div>
                      <FormControl>
                        <PasswordInput
                          placeholder="Confirm Password"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="mt-2 h-12 " loading={isLoading}>
                  <p className="font-20 font-normal">Submit</p>
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      )}

      {showVerify && <VerifyForm />}
    </div>
  );
}
