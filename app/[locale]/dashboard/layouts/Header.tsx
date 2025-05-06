import LocaleSwapper from "@/components/LocaleSwapper";
import ProfileNav from "@/components/ProfileNav";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  return (
    <nav className="sticky z-30 top-0 bg-white text-black shadow-sm h-[var(--header-height)] py-3 px-3 lg:px-4">
      <div className="flex justify-between items-center">
        <div className="flex">
          <SidebarTrigger className="cursor-pointer" />
        </div>
        <div className="flex items-center gap-2">
          <LocaleSwapper />
          <ProfileNav />
        </div>
      </div>
    </nav>
  );
}
