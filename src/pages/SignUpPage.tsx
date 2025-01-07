import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"

const formSchema = z.object({
  name: z
    .string()
    .nonempty({ message: "Name is required." })
    .max(50, { message: "Name must be at most 50 characters long." }),
  surname: z
    .string()
    .nonempty({ message: "Surname is required." })
    .max(50, { message: "Surname must be at most 50 characters long." }),
  birthdate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format.",
    })
    .refine((date) => new Date(date) <= new Date(), {
      message: "Birthdate cannot be in the future.",
    }),
  role: z.enum(["STUDENT", "TEACHER"], {
    errorMap: () => ({ message: "Role must be either STUDENT or TEACHER." }),
  }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(100, { message: "Password must be at most 100 characters long." }),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      birthdate: "",
      role: "STUDENT",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    
    const user = {
      name : values.name,
      surname : values.surname,
      birthdate : values.birthdate,
      role : values.role
    }
    
    axios.post("http://localhost:7001/user/register", user)
    .then((res) =>{
      const id = res.data.id
      const credential = {
        email: values.email,
        password : values.password,
        userid : id
      }
      axios.post("http://localhost:7001/credential/register",credential)
    .then((res) =>{
      console.log(res.data);
      setTimeout(() => {
        setIsLoading(false)
        toast({
          title: "Account created successfully!",
          description: "You can now log in with your new account.",
        })
        navigate("/login")
      }, 2000)
    })
    })
  }

  return (
    <div className="bg-cyan-50 blurred-background">
      <div className="flex p-4 w-full mx-auto flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md space-y-6 border border-cyan-800 rounded-xl p-4 bg-white shadow-xl content">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-cyan-600">
            Enter your details below to create your account
          </p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Prima Sezione */}
        <div className="space-y-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage className="text-red-500 text-sm"/>
              </FormItem>
            )}
          />

          {/* Surname */}
          <FormField
            control={form.control}
            name="surname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surname</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your surname" {...field} />
                </FormControl>
                <FormMessage className="text-red-500 text-sm"/>
              </FormItem>
            )}
          />

          {/* Birthdate */}
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birthdate</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="Select your birthdate" {...field} />
                </FormControl>
                <FormMessage className="text-red-500 text-sm"/>
              </FormItem>
            )}
          />

          {/* Role */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="TEACHER">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />
        </div>
        <div className="border-b border-b-cyan-800">
          Credential
        </div>
        {/* Seconda Sezione */}
        <div>
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage className="text-red-500 text-sm"/>
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm"/>
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className={`w-full ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-cyan-800 hover:bg-cyan-900'} text-white`}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Submit'}
        </Button>
      </form>
    </Form>
        <p className="px-8 text-center text-sm text-cyan-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
    </div>
  )
}
