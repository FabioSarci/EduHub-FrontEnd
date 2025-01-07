import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Calendar, Award } from 'lucide-react'
import axios from 'axios'


export default function LandingPage() {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-white blurred-background">
      <main className="flex flex-col items-center justify-center mx-auto w-full content">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="">
                <div className='space-y-2 mx-auto content mt-10'>
                  <h1 className="text-3xl font-bold tracking-tighter text-cyan-800 sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Welcome to EduHub
                  </h1>
                  <p className="mx-auto max-w-[700px] text-cyan-700 md:text-xl">
                    The all-in-one platform for modern education. Empower your learning journey with EduHub.
                  </p>
                  <div className="space-x-4">
                    <Button onClick={() =>{
                      const token = localStorage.getItem("ACCESS_TOKEN");
                      
                      if(!token){
                        navigate("/signup")
                      }else{
                        axios.get("http://localhost:7001/check",{
                          headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        })
                        .then((res) =>{
                          res.status === 200 && navigate("/dashboard")
                          
                        }).catch((err) =>{
                          err.status === 401 && navigate("/signup")
                          
                        })
                      }
                    }
                      }  className="bg-cyan-800 hover:bg-cyan-900 text-white">
                      Get Started
                    </Button>
                    <Button onClick={() =>{
                      const token = localStorage.getItem("ACCESS_TOKEN");
                      
                      if(!token){
                        navigate("/login")
                      }else{
                        axios.get("http://localhost:7001/check",{
                          headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        })
                        .then((res) =>{
                          res.status === 200 && navigate("/dashboard")
                          
                        }).catch((err) =>{
                          err.status === 401 && navigate("/login")
                          
                        })
                      }
                    }}  variant="outline" className="text-cyan-800 border-cyan-800 hover:bg-cyan-50">
                      Log In
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-cyan-50">
          <div className="px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-cyan-700 sm:text-4xl md:text-5xl text-center mb-8">
              Key Features
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<BookOpen className="h-10 w-10 text-cyan-800" />}
                title="Access Learning Materials"
                description="Easy access to course materials, lecture notes, and resources."
              />
              <FeatureCard
                icon={<Users className="h-10 w-10 text-cyan-800" />}
                title="Interactive Quizzes"
                description="Engage with online quizzes to test your knowledge and track progress."
              />
              <FeatureCard
                icon={<Calendar className="h-10 w-10 text-cyan-800" />}
                title="Attendance Tracking"
                description="Keep track of your class attendance and never miss an important session."
              />
              <FeatureCard
                icon={<Award className="h-10 w-10 text-cyan-800" />}
                title="Performance Analytics"
                description="Monitor your academic performance with detailed analytics and insights."
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-cyan-700 sm:text-4xl md:text-5xl">
                  Ready to Transform Your Learning Experience?
                </h2>
                <p className="mx-auto max-w-[600px] text-cyan-800 md:text-xl">
                  Join EduHub today and take your education to the next level. Sign up now to get started!
                </p>
              </div>
              <Button size="lg" onClick={() =>{
                      const token = localStorage.getItem("ACCESS_TOKEN");
                      
                      if(!token){
                        navigate("/signup")
                      }else{
                        axios.get("http://localhost:7001/check",{
                          headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        })
                        .then((res) =>{
                          res.status === 200 && navigate("/dashboard")
                          
                        }).catch((err) =>{
                          err.status === 401 && navigate("/signup")
                          
                        })
                      }
                    }} className="bg-cyan-800 hover:bg-cyan-900 text-white">
                Sign Up Now
              </Button>
            </div>
          </div>
        </section>
      </main>
      
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="bg-white border-cyan-200">
      <CardHeader>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-100 mb-4">
          {icon}
        </div>
        <CardTitle className="text-cyan-700">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-cyan-600">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
