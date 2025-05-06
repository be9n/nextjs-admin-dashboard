"use client";

import { useAuth } from "@/app/[locale]/context/AuthContext";
import { SidebarItem } from "@/app/[locale]/types/global";
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
import { cn } from "@/lib/utils";
import { ChevronRight, Home, LockKeyhole, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const items: SidebarItem[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Roles",
    icon: LockKeyhole,
    permission: "user_management.roles",
    children: [
      {
        title: "View All",
        url: "/dashboard/roles",
        activePatterns: ["^/dashboard/roles/[^/]+/edit$"],
        // permission: "user_management.roles.view_all",
      },
      {
        title: "Create Role",
        url: "/dashboard/roles/create",
        permission: "user_management.roles.create",
      },
    ],
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
  const { permissions } = useAuth();
  const { locale } = useParams();

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="shadow-md"
      side={locale === "ar" ? "right" : "left"}
    >
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
                if (item.permission && !permissions.includes(item.permission)) {
                  return null;
                }

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

function isPathActive(pathname: string, item: SidebarItem): boolean {
  // Check if current path exactly matches item URL
  if (pathname === item.url) return true;

  // Check if current path matches any active pattern
  if (item.activePatterns) {
    return item.activePatterns.some((pattern) =>
      new RegExp(pattern).test(pathname)
    );
  }

  return false;
}

function NormalSidebarItem({ sidebarItem }: { sidebarItem: SidebarItem }) {
  const pathname = usePathname();

  return (
    <SidebarMenuItem key={sidebarItem.title}>
      <SidebarMenuButton isActive={isPathActive(pathname, sidebarItem)} asChild>
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
  const { permissions } = useAuth();
  const { locale } = useParams();

  // Open the group if any child is "active" by our shared rules
  const isOpen = sidebarItem.children?.some((child) =>
    isPathActive(pathname, child)
  );

  return (
    <Collapsible defaultOpen={isOpen}>
      <SidebarMenuItem key={sidebarItem.url}>
        <CollapsibleTrigger asChild className="group/collapsible">
          <SidebarMenuButton className="cursor-pointer">
            {sidebarItem.icon && <sidebarItem.icon />}
            <span>{sidebarItem.title}</span>
            <ChevronRight
              className={cn(
                "ms-auto transition-transform group-data-[state=open]/collapsible:rotate-90",
                {
                  "rotate-180": locale === "ar",
                }
              )}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {sidebarItem.children?.map((child) => {
              if (child.permission && !permissions.includes(child.permission)) {
                return null;
              }

              return (
                <SidebarMenuSubItem key={child.title}>
                  <SidebarMenuSubButton
                    isActive={isPathActive(pathname, child)}
                    asChild
                    className="cursor-pointer"
                  >
                    <Link href={child.url || ""}>{child.title}</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
