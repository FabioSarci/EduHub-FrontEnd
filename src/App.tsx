import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import { SidebarProvider } from './contexts/sidebarProvider'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import { DashboardLayout } from './components/DashboardLayout'
import { AuthProvider } from './contexts/AuthContext'
import { UserProvider } from './contexts/UserContext'
import CoursePage from './pages/CoursePage'


function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <SidebarProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path='/' element={<LandingPage />} />
              </Route>
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
                  <Route path="/dashboard" element={<DashboardLayout><DashboardPage /></DashboardLayout>} />
                  <Route path="/course/{id}" element={<DashboardLayout><CoursePage /></DashboardLayout>} />
                  <Route path="/assignments" element={<DashboardLayout><div>Assignments Page</div></DashboardLayout>} />
                  <Route path="/grades" element={<DashboardLayout><div>Grades Page</div></DashboardLayout>} />
            </Routes>
            <Toaster />
          </SidebarProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
