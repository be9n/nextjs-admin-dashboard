"use client";

import FormButtons from "@/components/FormButtons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import MainPermissionGroups from "./MainPermissionGroupNodes";
import SelectAllPermissionNodes from "./SelectAllPermissionNodes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { setFormValidationErrors } from "@/lib/form-utils";
import { usePermissionSelection } from "../../../../../hooks/usePermissionSelection";
import { createRole, EditRole, updateRole } from "@/services/roles";
import { ApiError, PermissionNode } from "@/types/global";
import { getPermissionsList } from "@/services/permissions";

const formSchema = z.object({
  title: z.string().min(1, { message: "The title is required" }),
  permission_names: z
    .array(z.string())
    .min(1, { message: "You must select at least one permission." }),
  // .refine((value) => value.some((item) => item), {
  //   message: "You have to select at least one item.",
  // }),
});

export type RoleFormValues = z.infer<typeof formSchema>;

export default function RoleForm({ role }: { role?: EditRole }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: role?.title || "",
      permission_names: role?.permissions_list || [],
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const createMutation = useMutation({
    mutationFn: createRole,
  });

  const updateMutation = useMutation({
    mutationFn: updateRole,
  });

  const onSubmit = async (data: RoleFormValues) => {
    const actionPromise = role
      ? updateMutation.mutateAsync({ data: data, roleId: role.id })
      : createMutation.mutateAsync({ data: data });

    toast.promise(actionPromise, {
      loading: role ? "Updating Role..." : "Creating Role...",
      success: (res) => {
        queryClient.invalidateQueries({ queryKey: ["roles"] });
        router.push("/dashboard/roles");
        return { message: res.message };
      },
      error: (error: ApiError) => {
        setFormValidationErrors(form, error);
        return { message: "Something went wrong!", description: error.message };
      },
    });

    try {
      await actionPromise;
    } catch {}
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid col-span-1 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator className="my-6" />

          <PermissionSelection form={form} />

          <FormButtons
            onCancel={() => router.back()}
            isSubmitting={isSubmitting}
          />
        </form>
      </Form>
    </div>
  );
}

const PermissionSelection = ({
  form,
}: {
  form: UseFormReturn<RoleFormValues>;
}) => {
  const { data: permissionGroups, isLoading } = useQuery({
    queryKey: ["permissionsList"],
    queryFn: getPermissionsList,
    gcTime: 0,
  });

  return (
    <FormField
      control={form.control}
      name="permission_names"
      render={({ field }) => (
        <PermissionFieldContent
          field={field}
          permissionGroups={permissionGroups}
          isLoading={isLoading}
        />
      )}
    />
  );
};

// Extracted to a separate component to properly use hooks
const PermissionFieldContent = ({
  field,
  permissionGroups,
  isLoading,
}: {
  field: { value: string[]; onChange: (value: string[]) => void };
  permissionGroups: PermissionNode[] | null | undefined;
  isLoading: boolean;
}) => {
  const { toggleNames, isChecked } = usePermissionSelection(
    field.value,
    permissionGroups || undefined
  );

  const handleToggle = (checked: boolean, node?: PermissionNode) => {
    toggleNames(checked, node, field.onChange);
  };

  const handleSelectAll = (checked: boolean) => {
    toggleNames(checked, undefined, field.onChange);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-2">
        <FormLabel>Permissions</FormLabel>
        <FormMessage className="text-center" />
        <SelectAllPermissionNodes
          toggleNames={handleSelectAll}
          isChecked={isChecked}
        />
      </div>
      <div className="border rounded-md p-3">
        {isLoading ? (
          <span className="w-full my-20 flex items-center justify-center">
            <Loader2Icon className="size-10 text-gray-300 animate-spin" />
          </span>
        ) : (
          <MainPermissionGroups
            permissionGroups={permissionGroups || []}
            toggleNames={handleToggle}
            isChecked={isChecked}
          />
        )}
      </div>
    </div>
  );
};
