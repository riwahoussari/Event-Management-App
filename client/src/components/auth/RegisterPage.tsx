// src/pages/RegisterPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import type { UserType } from "@/types";
import AuthFormWrapper from "./AuthFormWrapper";

const registerSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().nonempty("Password is required"),
  gender: z.enum(["male", "female"]),
  phone_number: z.string().optional(),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  profile_pic: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      gender: undefined,
      phone_number: "",
      birthday: "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    setLoading(true);

    try {
      let profilePicUrl = "";

      // If a file is selected, upload to Cloudinary
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("upload_preset", "my_unsigned_preset"); // from Cloudinary settings

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/dlgft1vm9/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!cloudRes.ok) throw new Error("Image upload failed");

        const cloudData = await cloudRes.json();
        profilePicUrl = cloudData.secure_url;
      }

      // Send to backend with profile_pic field
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, profile_pic: profilePicUrl }),
      });

      // on success set user in context and go to homepage
      if (res.ok) {
        const json = (await res.json()) as { user: UserType };
        const { user } = json;

        setUser && setUser(user);
        navigate("/");
      } else {
        const result = await res.json();
        setError(result.error || "Something went wrong.");
      }
    } catch (e) {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormWrapper title="register">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormItem>
            <Label>Profile Picture</Label>
            <Input
              name="profile_pic"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedImage(e.target.files[0]);
                }
              }}
            />
          </FormItem>
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <Label>Full Name</Label>
                <Input placeholder="John Doe" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label>Email</Label>
                <Input type="email" placeholder="name@example.com" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label>Password</Label>
                <Input type="password" placeholder="••••••••" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <Label>Gender</Label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <Label>Phone Number</Label>
                <Input placeholder="+961 71 123 123" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <Label>Birthday</Label>
                <Input type="date" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
}
