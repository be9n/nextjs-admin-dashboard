import RoleForm from "../../components/RoleForm";
import { getRole } from "@/app/services/roles";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const role = await getRole(id);

  return (
    <div className="py-8 px-3 lg:px-4">
      <RoleForm role={role} />
    </div>
  );
}
