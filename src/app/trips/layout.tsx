"use client";
import { TripsSidebar } from "@/components/TripsSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function TripsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <TripsSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
