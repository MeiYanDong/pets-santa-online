"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SignInSchema, SignInValues } from "./validate";
import InputStartIcon from "../components/input-start-icon";
import InputPasswordContainer from "../components/input-password";
import { cn } from "@/lib/utils";
import { AtSign } from "lucide-react";

export default function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: SignInValues) {
    startTransition(async () => {
      const response = await signIn.username(data);

      if (response.error) {
        console.log("SIGN_IN:", response.error.message);
        toast.error(response.error.message);
      } else {
        router.push("/");
      }
    });
  }

  const getInputClassName = (fieldName: keyof SignInValues) =>
    cn(
      "rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-red-500 focus:ring-red-500/20 transition-all",
      form.formState.errors[fieldName] &&
        "border-red-500/80 text-red-600 focus:border-red-500 focus:ring-red-500/20",
    );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputStartIcon icon={AtSign}>
                  <Input
                    placeholder="Username"
                    className={cn("peer ps-9 h-12", getInputClassName("username"))}
                    disabled={isPending}
                    {...field}
                  />
                </InputStartIcon>
              </FormControl>
              <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputPasswordContainer>
                  <Input
                    id="input-password"
                    className={cn("pe-9 h-12", getInputClassName("password"))}
                    placeholder="Password"
                    disabled={isPending}
                    {...field}
                  />
                </InputPasswordContainer>
              </FormControl>
              <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
            </FormItem>
          )}
        />

        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "w-full py-4 mt-4 rounded-full font-bold text-lg shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2",
            isPending
              ? "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-500 cursor-not-allowed shadow-none"
              : "bg-red-600 text-white hover:bg-red-700 hover:-translate-y-0.5 shadow-red-200 dark:shadow-red-900/20"
          )}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </Form>
  );
}
