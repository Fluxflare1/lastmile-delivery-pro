"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export function useProfile() {
  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile/");
      setProfile(res.data);
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  const updateProfile = async (data: any, isFormData = false) => {
    try {
      const config = isFormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
      const res = await api.put("/profile/", data, config);
      setProfile(res.data);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, updateProfile };
}
