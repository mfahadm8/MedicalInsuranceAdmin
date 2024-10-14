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
import {
  JWT,
  confirmUserAttribute,
  fetchAuthSession,
  sendUserAttributeVerificationCode,
} from "aws-amplify/auth";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/utilities/AuthProvider";
interface ForgotFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  code: z.string().min(4, "Code is required"),
});

export function VerifyForm({ className, ...props }: ForgotFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "" },
  });

  async function currentSession() {
    try {
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      idToken && login(idToken as JWT);
    } catch (err) {
      console.log(err);
    }
  }
  // async function handleSendUserAttributeVerificationCode() {
  //   const key = "email";
  //   try {
  //     await sendUserAttributeVerificationCode({
  //       userAttributeKey: key,
  //     });
  //     toast({
  //       title: "Code Sent Successfully.",
  //       duration: 2000,
  //       variant: "success",
  //     });
  //   } catch (error: any) {
  //     toast({
  //       title: error?.message || "An error occurred.",
  //       duration: 2000,
  //       variant: "destructive",
  //     });
  //   }
  // }
  async function handleConfirmUserAttribute(code: string) {
    const userAttributeKey = "email";
    const confirmationCode = code;
    try {
      await confirmUserAttribute({
        userAttributeKey,
        confirmationCode,
      });
      await currentSession();

      toast({
        title: "Logged in successfully.",
        duration: 2000,
        variant: "success",
      });
    } catch (error) {
      console.log(error);
    }
  }
  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    handleConfirmUserAttribute(data.code);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Card className="  shadow-none rounded-md border-0">
        {/* <h2 className="text-lg font-semibold text-foreground">
          Reset Password
        </h2> */}
        <p className=" text-muted-foreground text-sm mt-2 mb-3">
          Enter Verification Code Sent To Your Email
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter code"
                        {...field}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-2 h-12" loading={isLoading}>
                <p className="font-18 font-normal">Submit</p>
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
