"use client";

import { PermissionNode } from "@/app/types/global";
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
import { useQuery } from "@tanstack/react-query";
import { getPermissionsList } from "@/app/services/permissions";
import { Loader2Icon } from "lucide-react";

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

export default function RoleForm() {
  const router = useRouter();
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      permission_names: [],
    },
  });
  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = (data: RoleFormValues) => {
    console.log(data);
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
      render={({ field }) => {
        const selectedPermissions = field.value;
        const getAllNodeNames = (n: PermissionNode): string[] => {
          return [n.name, ...(n.children?.flatMap(getAllNodeNames) ?? [])];
        };

        const getAllNames = () => permissionGroups?.flatMap(getAllNodeNames);

        const toggleNames = (checked: boolean, node?: PermissionNode) => {
          const keys = node ? getAllNodeNames(node) : getAllNames();

          let updated = checked
            ? [...new Set([...selectedPermissions, ...(keys || [])])]
            : selectedPermissions.filter((k) => !(keys || []).includes(k));

          // Helper: Recursively remove parent key if none of its children are selected
          const cleanUnselectedParents = (nodes: PermissionNode[]) => {
            for (const current of nodes) {
              if (current.children && current.children.length > 0) {
                const childKeys = getAllNodeNames(current).filter(
                  (k) => k !== current.name
                );
                const isAnyChildSelected = childKeys.some((k) =>
                  updated.includes(k)
                );

                if (!isAnyChildSelected) {
                  // Remove this parent's key
                  updated = updated.filter((k) => k !== current.name);
                }

                // Recurse through children
                cleanUnselectedParents(current.children);
              }
            }
          };

          // Only run cleanup on uncheck
          if (!checked) {
            cleanUnselectedParents(permissionGroups || []);
          }

          field.onChange(updated);
        };

        const isChecked = (node?: PermissionNode): boolean => {
          const keys = node ? getAllNodeNames(node) : getAllNames();

          return (keys || []).every((key) => selectedPermissions.includes(key));
        };

        return (
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <FormLabel>Permissions</FormLabel>
              <FormMessage className="text-center" />
              <SelectAllPermissionNodes
                toggleNames={toggleNames}
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
                  toggleNames={toggleNames}
                  isChecked={isChecked}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  );
};
