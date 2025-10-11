"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProfile } from "../hooks/useProfile";
import ProfileAvatar from "../components/ProfileAvatar";

const ProfileSchema = z.object({
  full_name: z.string().min(2, "Full name required"),
  phone_number: z.string().min(5, "Phone number required"),
});

export default function ProfileForm() {
  const { profile, updateProfile } = useProfile();
  const form = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || "",
        phone_number: profile.phone_number || "",
      });
    }
  }, [profile, form]);

  const handleSubmit = (values: any) => {
    updateProfile(values);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <ProfileAvatar />
      <div>
        <label>Full Name</label>
        <Input {...form.register("full_name")} />
      </div>
      <div>
        <label>Phone Number</label>
        <Input {...form.register("phone_number")} />
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
}
