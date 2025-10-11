import ProfileForm from "./ProfileForm";

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <ProfileForm />
    </div>
  );
}
