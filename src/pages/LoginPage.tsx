import { useState } from "react"
import { Link } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import axios from "axios"
import { Eye, EyeOff, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"



const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Min 8 character",
  }),
})

type LoginFormValues = z.infer<typeof formSchema>;

const initialValues = {
    email: "",
    password: "",
};

export default function LoginPage() {
  const [isLoading] = useState(false)
  const { setAsLogged } = useAuth();
  const [error, setError] = useState<"generic" | "credentials" | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const{
    register,
    handleSubmit,
    formState: { errors },
} = useForm<LoginFormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(formSchema),
});

  

  const submitHandler: SubmitHandler<LoginFormValues> = (data) => {
    
    setError(null);
    axios
            .post('http://localhost:7001/login', data)
            .then(({ data: { token } }) => {
                setAsLogged(token);
            })
            .catch((err) => {

              setError(err.status === 401 ? "credentials" : "generic");
            });
  }

  return (
    <div className="blurred-background">
      <div className="flex h-screen w-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-cyan-50">
      <div className="mx-auto w-full max-w-md space-y-6 border border-cyan-800 rounded-xl p-4 bg-white shadow-xl content">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-cyan-600">
            Enter your credentials to access your account
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
                <Input
                    {...register("email", { required: true })}
                    placeholder="Email"
                    type="email"
                    name="email"
                />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message as string}</span>
                )}
                <div className="relative">
                    <Input
                        {...register("password", { required: true })}
                        placeholder="Password"
                        className="pr-10"
                        type={isPasswordVisible ? "text" : "password"}
                        name="password"
                    />
                    <Button
                        type="button"
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-0 size-8 cursor-pointer"
                        variant="ghost"
                        onClick={() => {
                            setIsPasswordVisible(!isPasswordVisible);
                        }}>
                        <span className="pointer-events-none">
                            {isPasswordVisible ? <EyeOff /> : <Eye />}
                        </span>
                    </Button>
                </div>
                {errors.password && (
                    <span className="text-red-500">{errors.password.message as string}</span>
                )}
                <Button type="submit" className="w-full bg-cyan-800 hover:bg-cyan-900 text-white" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Log in"}
                </Button>
            </form>
            {error && (
                <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>
                        {error === "credentials" ? "Invalid credentials" : "Error during login"}
                    </AlertTitle>
                    <AlertDescription>
                        {error === "credentials"
                            ? "The provided credentials are not correct."
                            : "There was an error during login action"}
                    </AlertDescription>
                </Alert>
            )}
        <p className="px-8 text-center text-sm text-cyan-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
    </div>
  )
}
