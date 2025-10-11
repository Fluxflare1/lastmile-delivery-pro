"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useProfile } from "../hooks/useProfile";

export default function ProfileAvatar() {
  const { profile, updateProfile } = useProfile();
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("profile_image", image);
    await updateProfile(formData, true);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24 rounded-full overflow-hidden border">
        {profile?.profile_image ? (
          <Image
            src={profile.profile_image}
            alt="Profile"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-500">
            No Image
          </div>
        )}
      </div>
      <div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <Button type="button" onClick={handleUpload} className="mt-2">
          Upload
        </Button>
      </div>
    </div>
  );
}



