// app/layout.tsx

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";

export const metadata = {
  title: 'Admin Panel',
  description: 'Admin dashboard with sidebar navigation.',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <SidebarInset className="flex-1 flex flex-col">
          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Main Content Area */}
            <div className="flex-1 bg-primary dark:bg-secondary rounded-xl p-6 shadow-md">
              {/* Dynamic Page Content */}
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default RootLayout;
