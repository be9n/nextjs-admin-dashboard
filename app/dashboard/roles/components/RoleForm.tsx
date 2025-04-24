"use client";

import FormButtons from "@/components/FormButtons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { PermissionNode, PermissionSelector } from "./PermissionSelector";

type Permission = {
  id: number;
  key: string;
  name: string;
  checked: boolean;
  children?: Permission[];
};

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
    formState: { isSubmitting, errors },
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

          <div className="flex items-center justify-between">
            <h3
              className={cn("font-bold", {
                "text-destructive": errors.permission_ids,
              })}
            >
              Permissions
            </h3>
            {errors.permission_ids && (
              <span className="mx-auto text-destructive">
                {errors.permission_ids.message}
              </span>
            )}
            <SelectAllPermissions form={form} />
          </div>
          <MainPermissionGroups form={form} />

          {/* <FormField
            control={form.control}
            name="permission_ids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Permissions</FormLabel>
                <FormControl>
                  <div className="border rounded-md p-3 space-y-2">
                    {permissionGroups.map((group) => (
                      <PermissionSelector
                        key={group.key}
                        node={group}
                        selected={field.value}
                        onToggle={(key, keys) => {
                          const isAlreadySelected = field.value.includes(key);
                          const updated = isAlreadySelected
                            ? field.value.filter((k) => !keys.includes(k))
                            : [...new Set([...field.value, ...keys])];
                          field.onChange(updated);
                        }}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormButtons
            onCancel={() => router.back()}
            isSubmitting={isSubmitting}
          />
        </form>
      </Form>
    </div>
  );
}

const SelectAllPermissions = ({
  form,
}: {
  form: UseFormReturn<RoleFormValues>;
}) => {
  return (
    <FormField
      control={form.control}
      name="permission_ids"
      render={({ field }) => (
        <FormItem className="flex items-center gap-2">
          <Checkbox
            className="cursor-pointer"
            checked={permissionGroups.every((mainPermissionGroup) =>
              mainPermissionGroup.children?.every((subPermissionGroup) =>
                subPermissionGroup.children?.every((permission) =>
                  field.value?.includes(permission.key)
                )
              )
            )}
            onCheckedChange={(checked) => {
              const allPermissions =
                permissionGroups
                  .map((mainPermissionGroup) =>
                    mainPermissionGroup.children
                      ?.map((subPermissionGroup) =>
                        subPermissionGroup.children?.map(
                          (permission) => permission.key
                        )
                      )
                      .flat()
                  )
                  .flat() || [];

              return checked
                ? field.onChange([...field.value, ...allPermissions])
                : field.onChange(
                    field.value?.filter(
                      (value) => !allPermissions?.includes(value)
                    )
                  );
            }}
          />

          <FormLabel
            destructiveOnError={false}
            className="text-md cursor-pointer text-foreground"
          >
            Select All
          </FormLabel>
        </FormItem>
      )}
    />
  );
};

const MainPermissionGroups = ({
  form,
}: {
  form: UseFormReturn<RoleFormValues>;
}) => {
  return (
    <Accordion
      type="multiple"
      defaultValue={permissionGroups.map((item) => item.id.toString())}
    >
      {permissionGroups.map((permissionGroup) => (
        <FormField
          key={permissionGroup.id}
          control={form.control}
          name="permission_ids"
          render={({ field }) => (
            <AccordionItem value={permissionGroup.id.toString()}>
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={permissionGroup.children?.every((child) =>
                        child.children?.every((permission) =>
                          field.value?.includes(permission.key)
                        )
                      )}
                      onCheckedChange={(checked) => {
                        const allPermissions =
                          permissionGroup.children
                            ?.map((child) => {
                              return child.children?.map(
                                (permission) => permission.key
                              );
                            })
                            .flat() || [];

                        return checked
                          ? field.onChange([...field.value, ...allPermissions])
                          : field.onChange(
                              field.value?.filter(
                                (value) => !allPermissions?.includes(value)
                              )
                            );
                      }}
                    />
                  </FormControl>
                  <AccordionTrigger className="justify-start gap-2 cursor-pointer hover:font-semibold hover:no-underline">
                    <FormLabel asChild className="text-sm font-normal">
                      <span>{permissionGroup.name}</span>
                    </FormLabel>
                  </AccordionTrigger>
                </div>
                <AccordionContent>
                  <SubPermissionGroups
                    form={form}
                    subPermissionGroups={permissionGroup.children || []}
                  />
                </AccordionContent>
              </FormItem>
            </AccordionItem>
          )}
        />
      ))}
    </Accordion>
  );
};

const SubPermissionGroups = ({
  subPermissionGroups,
  form,
}: {
  subPermissionGroups: Permission[];
  form: UseFormReturn<RoleFormValues>;
}) => {
  return (
    <div className="flex flex-col gap-3 ms-3">
      {subPermissionGroups.map((subPermissionGroup, index) => (
        <FormField
          key={subPermissionGroup.id}
          control={form.control}
          name="permission_ids"
          render={({ field }) => (
            <FormItem>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 min-w-[250px]">
                    <FormControl>
                      <Checkbox
                        className="cursor-pointer"
                        checked={subPermissionGroup.children?.every(
                          (permission) => field.value?.includes(permission.key)
                        )}
                        onCheckedChange={(checked) => {
                          const allPermissionKeys =
                            subPermissionGroup.children?.map(
                              (permission) => permission.key
                            ) || [];

                          return checked
                            ? field.onChange([
                                ...field.value,
                                ...allPermissionKeys,
                              ])
                            : field.onChange(
                                field.value.filter(
                                  (value) => !allPermissionKeys.includes(value)
                                )
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">
                      {subPermissionGroup.name}
                    </FormLabel>
                  </div>

                  <Permissions
                    form={form}
                    permissions={subPermissionGroup.children || []}
                  />
                </div>

                {index !== subPermissionGroups.length - 1 && (
                  <Separator className="mt-3" />
                )}
              </div>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};

const Permissions = ({
  permissions,
  form,
}: {
  permissions: Permission[];
  form: UseFormReturn<RoleFormValues>;
}) => {
  return (
    <div>
      <div className="flex items-center gap-4 flex-wrap ms-4">
        {permissions.map((permission) => (
          <FormField
            key={permission.id}
            control={form.control}
            name="permission_ids"
            render={({ field }) => {
              return (
                <FormItem
                  key={permission.id}
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      className="cursor-pointer"
                      checked={field.value?.includes(permission.key)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, permission.key])
                          : field.onChange(
                              field.value?.filter(
                                (value) => value !== permission.key
                              )
                            );
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    {permission.name}
                  </FormLabel>
                </FormItem>
              );
            }}
          />
        ))}
      </div>
    </div>
  );
};
