"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { subjects } from "@/constants";
import { Textarea } from "./ui/textarea";
import { createCompanion } from "@/lib/actions/companion.actions";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
const formSchema = z.object({
  name: z.string().min(1, { message: "Companion is required" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  topic: z.string().min(1, { message: "topic is required" }),
  voice: z.string().min(1, { message: "voice is required" }),
  style: z.string().min(1, { message: "style is required" }),
  duration: z.coerce.number().min(1, { message: "duration is required" }),
});

const CompanionsForm = () => {
  // 1. Define your form.
  type CompanionsFormValues = z.infer<typeof formSchema>;
  const router = useRouter();
  const { isSignedIn, isLoaded, userId } = useAuth();
  
  const form = useForm<CompanionsFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      subject: "",
      topic: "",
      voice: "",
      style: "",
      duration: 15,
    },
  });

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render form if not signed in
  if (!isSignedIn) {
    return null;
  }

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Form submitted with values:", values);
      console.log("User is signed in:", isSignedIn);
      console.log("User ID:", userId);
      
      if (!userId) {
        throw new Error("User ID not available");
      }
      
      const companion = await createCompanion({ ...values, author: userId });
      
      if (companion) {
        router.push(`/companions/${companion.id}`);
      } else {
        console.error("Error creating companion");
        router.push(`/`);
      }
    } catch (error) {
      console.error("Failed to create companion:", error);
      // You could show a toast notification here
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Companion Name </FormLabel>
              <FormControl>
                <Input
                  className="input"
                  placeholder="Enter the companion name "
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="input capitalize ">
                    <SelectValue placeholder="Select the subject " />
                  </SelectTrigger>
                  <SelectContent>
                    {" "}
                    {subjects.map((subject) => (
                      <SelectItem
                        value={subject}
                        key={subject}
                        className="capitalize "
                      >
                        {subject}
                      </SelectItem>
                    ))}{" "}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel> what should the companion help with ? </FormLabel>
              <FormControl>
                <Textarea
                  className="input"
                  placeholder="Ex. Derivates & Integrals "
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="voice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voice</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="input  ">
                    <SelectValue placeholder="Select the Voice " />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male"> Male</SelectItem>
                    <SelectItem value="female"> Female</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Style</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="input  ">
                    <SelectValue placeholder="Select the Style " />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Formal"> Formal</SelectItem>
                    <SelectItem value="casual"> Casual</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated session duration in minutes </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="input"
                  placeholder="15"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full cursor-pointer">
          Build your companion
        </Button>
      </form>
    </Form>
  );
};

export default CompanionsForm;
