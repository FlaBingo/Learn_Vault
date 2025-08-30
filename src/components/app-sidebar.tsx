"use client";

import { Calendar, Home, IconNode, Inbox, LogOut, LucideProps, Plus, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { signOut } from "@/services/auth"
// import { useIsMobile } from "@/hooks/use-mobile"
// import { cn } from "@/lib/utils"
// Menu items.
const items: {title: string, url: string, icon: typeof Plus, action?: () => void}[] = [
  {
    title: "Repository",
    url: "/new_repo",
    icon: Plus,
  },
  {
    title: "Log out",
    url: "#",
    icon: LogOut,
    action: () => signOut()
  },
] as const;

export function AppSidebar() {
  // const isMobile = useIsMobile();
  return (
    <Sidebar  side="right">
      <SidebarContent className="sm:hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} onClick={(e) => {
                      if (item.action) {
                        e.preventDefault();
                        item.action();
                      }
                    }}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}