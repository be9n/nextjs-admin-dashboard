import ProductForm from "../components/ProductForm";

export default function CreatePage() {
  return (
    <div className="py-8 px-3 lg:px-4">
      <div className="mb-8">
        <h1 className="font-bold text-3xl">Create Product</h1>
      </div>
      <ProductForm />
    </div>
  );
}
