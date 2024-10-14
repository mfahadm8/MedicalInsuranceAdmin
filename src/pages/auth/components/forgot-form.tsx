import { HTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/shared/button";
import { PasswordInput } from "@/components/shared/password-input";
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
import { confirmResetPassword, resetPassword } from "aws-amplify/auth";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
interface ForgotFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
});

export function ForgotForm({ className, ...props }: ForgotFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const handleResetPasswordNextSteps = (output: any) => {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case "CONFIRM_RESET_PASSWORD_WITH_CODE":
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        toast({
          title: `Confirmation code was sent to ${form.getValues("email")}`,
          duration: 2000,
          variant: "success",
        });
        console.log(
          `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`
        );
        break;
      case "DONE":
        console.log("Successfully reset password.");
        break;
      default:
        break;
    }
  };
  const handleResetPassword = async (username: string) => {
    try {
      const output = await resetPassword({ username });
      handleResetPasswordNextSteps(output);
      setStep(2);
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
    handleResetPassword(data.email);
  }
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {step === 1 && (
        <Card className="  shadow-none rounded-md border-0">
          <h2 className="text-lg font-semibold text-foreground">
            Reset Password
          </h2>
          <p className=" text-muted-foreground text-sm mt-2 mb-3">
            Enter your registered email to reset your password.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">Email</FormLabel>
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
                <Button className="mt-2 h-12" loading={isLoading}>
                  <p className="font-18 font-normal">Reset Password</p>
                </Button>
              </div>
            </form>
          </Form>

          <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
            Remember your password?&nbsp;
            <a
              href="/sign-in"
              className="underline underline-offset-4 hover:text-primary"
            >
              Try Sign In.
            </a>{" "}
          </p>
        </Card>
      )}
      {step == 2 && <NextStep username={form.getValues("email")} />}
    </div>
  );
}

function NextStep({ username }: { username: string }) {
  const navigate = useNavigate();
  const formSchema = z
    .object({
      code: z.string().min(1, {
        message: "Please enter code",
      }),

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

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "", code: "" },
  });

  const handleConfirmResetPassword = async (
    confirmationCode: string,
    newPassword: string
  ) => {
    try {
      await confirmResetPassword({ username, confirmationCode, newPassword });
      toast({
        title: "Password reset confirmed successfully.",
        variant: "success",
        duration: 2000,
      });
      navigate("/sign-in");
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
    handleConfirmResetPassword(data.code, data.confirmPassword);
    console.log(data);
  }

  return (
    <div className={cn("grid gap-6")}>
      <Card className=" shadow-none rounded-md border-0">
        <h2 className="font-36 mb-4 font-semibold text-foreground">
          Reset your password
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-foreground">Code</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter code"
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
                    <FormLabel className="text-foreground">
                      Confirm Password
                    </FormLabel>
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
    </div>
  );
}
