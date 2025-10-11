import AddressForm from "./AddressForm";
import AddressList from "./AddressList";

export default function AddressesPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Addresses</h1>
      <AddressForm />
      <AddressList />
    </div>
  );
}
