import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Sidebar as ShadcnSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { BookOpen, Users, Calendar, Award } from 'lucide-react'
import { useAuth } from "@/contexts/AuthContext"

export function Sidebar() {

  const {logout} = useAuth()
  const location = useLocation()


  return (
    <ShadcnSidebar className="border-r border-cyan-200 bg-white">
      <SidebarHeader className="border-b border-cyan-800 p-4">
        <Link to="/" className="flex items-center">
          <BookOpen className="h-6 w-6 text-cyan-500" />
          <span className="ml-2 text-xl font-bold text-cyan-700">EduHub</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === '/dashboard'}>
              <Link to="/dashboard">
                <Users className="h-4 w-4 mr-2" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === '/courses'}>
              <Link to="/courses">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Courses</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === '/assignments'}>
              <Link to="/assignments">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Assignments</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === '/grades'}>
              <Link to="/grades">
                <Award className="h-4 w-4 mr-2" />
                <span>Grades</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={logout} variant="ghost" className="w-full justify-start border-t border-t-cyan-800 mr-2 h-4 mt-2 mb-2 p-4" asChild>
            <button>
              Log out
            </button>
        </Button>
      </SidebarFooter>
    </ShadcnSidebar>
  )
}