import CategoryForm from "../components/CategoryForm";

export default function CreateCategoryPage() {
  return (
    <div className="py-8 px-3 lg:px-4">
      <div className="mb-8">
        <h1 className="font-bold text-3xl">Create Category</h1>
      </div>
      <CategoryForm />
    </div>
  );
}
