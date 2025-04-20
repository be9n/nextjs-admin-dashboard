import { SidebarTrigger } from "@/components/ui/sidebar";
import ProfileNav from "../../../components/ProfileNav";

export default function Header() {
  return (
    <nav className="sticky z-30 top-0 bg-white text-black shadow-sm h-14 py-3 px-3 lg:px-4">
      <div className="flex justify-between items-center">
        <div className="flex">
          <SidebarTrigger className="cursor-pointer" />
        </div>
        <div>
          <ProfileNav />
        </div>
      </div>
    </nav>
  );
}
