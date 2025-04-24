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

const permissionGroups: PermissionNode[] = [
  {
    id: 1,
    key: "administrations_management",
    name: "Administrations Management",
    checked: false,
    children: [
      {
        id: 2,
        key: "administrations_management.property_groups",
        name: "Property Groups",
        checked: false,
        children: [
          {
            id: 3,
            key: "administrations_management.property_groups.view_all",
            name: "View All",
            checked: false,
          },
          {
            id: 4,
            key: "administrations_management.property_groups.create",
            name: "Create",
            checked: false,
          },
          {
            id: 5,
            key: "administrations_management.property_groups.edit",
            name: "Edit",
            checked: false,
          },
          {
            id: 6,
            key: "administrations_management.property_groups.view",
            name: "View",
            checked: false,
          },
          {
            id: 7,
            key: "administrations_management.property_groups.delete",
            name: "Delete",
            checked: false,
          },
          {
            id: 8,
            key: "administrations_management.property_groups.restore",
            name: "Restore",
            checked: false,
          },
          {
            id: 9,
            key: "administrations_management.property_groups.force_delete",
            name: "Force Delete",
            checked: false,
          },
        ],
      },
      {
        id: 225,
        key: "administrations_management.properties",
        name: "Properties",
        checked: false,
        children: [
          {
            id: 226,
            key: "administrations_management.properties.view_all",
            name: "View All",
            checked: false,
            children: [],
          },
          {
            id: 227,
            key: "administrations_management.properties.create",
            name: "Create",
            checked: false,
            children: [],
          },
          {
            id: 228,
            key: "administrations_management.properties.edit",
            name: "Edit",
            checked: false,
            children: [],
          },
          {
            id: 229,
            key: "administrations_management.properties.view",
            name: "View",
            checked: false,
            children: [],
          },
          {
            id: 230,
            key: "administrations_management.properties.delete",
            name: "Delete",
            checked: false,
            children: [],
          },
          {
            id: 231,
            key: "administrations_management.properties.restore",
            name: "Restore",
            checked: false,
            children: [],
          },
          {
            id: 232,
            key: "administrations_management.properties.force_delete",
            name: "Force Delete",
            checked: false,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 10,
    key: "app_content_management",
    name: "App Content Management",
    checked: false,
    children: [
      {
        id: 11,
        key: "app_content_management.all_banners",
        name: "All Banners",
        checked: false,
        children: [
          {
            id: 12,
            key: "app_content_management.all_banners.view_all",
            name: "View All",
            checked: false,
          },
          {
            id: 13,
            key: "app_content_management.all_banners.create",
            name: "Create",
            checked: false,
          },
          {
            id: 14,
            key: "app_content_management.all_banners.edit",
            name: "Edit",
            checked: false,
          },
          {
            id: 15,
            key: "app_content_management.all_banners.view",
            name: "View",
            checked: false,
          },
          {
            id: 16,
            key: "app_content_management.all_banners.change_status",
            name: "Change Status",
            checked: false,
          },
          {
            id: 17,
            key: "app_content_management.all_banners.delete",
            name: "Delete",
            checked: false,
          },
          {
            id: 18,
            key: "app_content_management.all_banners.restore",
            name: "Restore",
            checked: false,
          },
          {
            id: 19,
            key: "app_content_management.all_banners.force_delete",
            name: "Force Delete",
            checked: false,
          },
        ],
      },
    ],
  },
  {
    id: 20,
    key: "branch_management",
    name: "Branch Management",
    checked: false,
    children: [
      {
        id: 21,
        key: "branch_management.products",
        name: "Products",
        checked: false,
        children: [
          {
            id: 22,
            key: "branch_management.products.view_all",
            name: "View All",
            checked: false,
          },
          {
            id: 23,
            key: "branch_management.products.create",
            name: "Create",
            checked: false,
          },
          {
            id: 24,
            key: "branch_management.products.edit",
            name: "Edit",
            checked: false,
          },
          {
            id: 25,
            key: "branch_management.products.delete",
            name: "Delete",
            checked: false,
          },
        ],
      },
      {
        id: 26,
        key: "branch_management.categories",
        name: "Categories",
        checked: false,
        children: [
          {
            id: 27,
            key: "branch_management.categories.view_all",
            name: "View All",
            checked: false,
          },
          {
            id: 28,
            key: "branch_management.categories.create",
            name: "Create",
            checked: false,
          },
          {
            id: 29,
            key: "branch_management.categories.edit",
            name: "Edit",
            checked: false,
          },
          {
            id: 30,
            key: "branch_management.categories.delete",
            name: "Delete",
            checked: false,
          },
        ],
      },
      {
        id: 31,
        key: "branch_management.delivery_times",
        name: "Delivery Times",
        checked: false,
        children: [
          {
            id: 32,
            key: "branch_management.delivery_times.view_all",
            name: "View All",
            checked: false,
          },
          {
            id: 33,
            key: "branch_management.delivery_times.create",
            name: "Create",
            checked: false,
          },
          {
            id: 34,
            key: "branch_management.delivery_times.edit",
            name: "Edit",
            checked: false,
          },
          {
            id: 35,
            key: "branch_management.delivery_times.delete",
            name: "Delete",
            checked: false,
          },
        ],
      },
      {
        id: 36,
        key: "branch_management.banners",
        name: "Banners",
        checked: false,
        children: [
          {
            id: 37,
            key: "branch_management.banners.view_all",
            name: "View All",
            checked: false,
          },
          {
            id: 38,
            key: "branch_management.banners.create",
            name: "Create",
            checked: false,
          },
          {
            id: 39,
            key: "branch_management.banners.edit",
            name: "Edit",
            checked: false,
          },
          {
            id: 40,
            key: "branch_management.banners.delete",
            name: "Delete",
            checked: false,
          },
        ],
      },
    ],
  },
];

const formSchema = z.object({
  title: z.string().min(1, { message: "The title is required" }),
  permission_ids: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
});

type RoleFormValues = z.infer<typeof formSchema>;

export default function RoleForm() {
  const router = useRouter();
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      permission_ids: [],
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
  return (
    <FormField
      control={form.control}
      name="permission_ids"
      render={({ field }) => {
        const selectedPermissions = field.value;
        const getAllNodeKeys = (n: PermissionNode): string[] => {
          return [n.key, ...(n.children?.flatMap(getAllNodeKeys) ?? [])];
        };

        const getAllKeys = () => permissionGroups.flatMap(getAllNodeKeys);

        const toggleKeys = (checked: boolean, node?: PermissionNode) => {
          const keys = node ? getAllNodeKeys(node) : getAllKeys();

          field.onChange(
            checked
              ? [...new Set([...selectedPermissions, ...keys])]
              : selectedPermissions.filter((k) => !keys.includes(k))
          );
        };

        const isChecked = (node?: PermissionNode): boolean => {
          const keys = node ? getAllNodeKeys(node) : getAllKeys();

          return keys.every((key) => selectedPermissions.includes(key));
        };

        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <FormLabel>Permissions</FormLabel>
              <FormMessage />
              <SelectAllPermissionNodes
                toggleKeys={toggleKeys}
                isChecked={isChecked}
              />
            </div>
            <div className="border rounded-md p-3">
              <MainPermissionGroups
                permissionGroups={permissionGroups}
                toggleKeys={toggleKeys}
                isChecked={isChecked}
              />
            </div>
          </div>
        );
      }}
    />
  );
};
