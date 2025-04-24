"use client";

import { SidebarItem } from "@/app/types/global";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight, Home, LockKeyhole, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items: SidebarItem[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Roles",
    icon: LockKeyhole,
    children: [
      {
        title: "View All",
        url: "/dashboard/roles",
      },
      {
        title: "Create Role",
        url: "/dashboard/roles/create",
      },
    ]
  },
  {
    title: "Products",
    icon: ShoppingBag,
    children: [
      {
        title: "View All",
        url: "/dashboard/products",
      },
      {
        title: "Create Product",
        url: "/dashboard/products/create",
      },
    ],
  },
];

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="sidebar" className="shadow-md">
      <SidebarContent>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="-mb-4" size={"lg"} asChild>
                <Link href={"/dashboard"} className="flex gap-2 items-center">
                  <div>Logo</div>
                  <div>Text</div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (item.children) {
                  return (
                    <CollapsibleSidebarItem
                      key={item.title}
                      sidebarItem={item}
                    />
                  );
                }

                return (
                  <NormalSidebarItem key={item.title} sidebarItem={item} />
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function NormalSidebarItem({ sidebarItem }: { sidebarItem: SidebarItem }) {
  const pathname = usePathname();

  return (
    <SidebarMenuItem key={sidebarItem.title}>
      <SidebarMenuButton isActive={pathname === sidebarItem.url} asChild>
        <Link href={sidebarItem.url || ""}>
          {sidebarItem.icon && <sidebarItem.icon />}
          <span>{sidebarItem.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function CollapsibleSidebarItem({ sidebarItem }: { sidebarItem: SidebarItem }) {
  const pathname = usePathname();
  const isOpen = sidebarItem.children?.some(
    (child) => child.url && pathname.startsWith(child.url)
  );

  return (
    <Collapsible defaultOpen={isOpen}>
      <SidebarMenuItem key={sidebarItem.url}>
        <CollapsibleTrigger asChild className="group/collapsible">
          <SidebarMenuButton className="cursor-pointer">
            {sidebarItem.icon && <sidebarItem.icon />}
            <span>{sidebarItem.title}</span>
            <ChevronRight
              className={
                "ms-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
              }
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {sidebarItem.children?.map((child) => (
              <SidebarMenuSubItem key={child.title}>
                <SidebarMenuSubButton
                  isActive={pathname === child.url}
                  asChild
                  className="cursor-pointer"
                >
                  <Link href={child.url || ""}>{child.title}</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
