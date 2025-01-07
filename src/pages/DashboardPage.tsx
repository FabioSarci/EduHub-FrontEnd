import { useAuth } from "@/contexts/AuthContext";
import { useCourseContext } from "@/contexts/CourseContext";
import { ICourseProps } from "@/interfaces/Course";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {

  const {user} = useAuth()
  const {usercourses, getCourses} = useCourseContext();
  const [courses, setCourses] = useState<ICourseProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserCourses = async () => {
      const token = localStorage.getItem("ACCESS_TOKEN");
      if(token && user?.id && !usercourses?.length) {
        await getCourses(token, user.id);
      }
    };
    
    fetchUserCourses();
  }, [user?.id]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const token = localStorage.getItem("ACCESS_TOKEN");
      if (token && (usercourses ?? []).length > 0 && isLoading) {
        try {
          const responses = await Promise.all(
            (usercourses ?? []).map(course => 
              axios.get(`http://localhost:7001/course/${course.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
            )
          );
          
          const courseData = responses.map(res => res.data);
          setCourses(courseData);
          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching courses:", err);
          setIsLoading(false);
        }
      }
    };

    fetchCourseDetails();
  }, [usercourses, isLoading]);

  return (
    <>
      <div className="content pt-2">
        
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          {courses?.map((course) => (
                    <CourseCard
                        key={course.id}
                        subject={course.subject}
                        course={course.coursename}
                        section={course.section}
                        id={course.id.toString()}
                    />
                ))}
        </div>
      </div>
    </>
  )
}

function CourseCard({ subject, course, section, id}: { subject: string; course: string; section: string, id:string }) {
    const navigate = useNavigate()
    return (
        <button 
            onClick={() => {navigate(`/course/${id}`)}}
            className="w-full transition-all duration-300 hover:scale-[1.02]"
        >
            <div className="flex flex-col h-full p-6 bg-white shadow-lg rounded-2xl border-2 border-cyan-500 hover:border-cyan-600">
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-cyan-700">{subject}</h2>
                        <span className="px-3 py-1 text-xs font-medium text-cyan-600 bg-cyan-100 rounded-full">
                            {section}
                        </span>
                    </div>
                    <p className="text-lg text-cyan-600">{course}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-cyan-100">
                    <p className="text-sm text-cyan-500 flex items-center">
                        Clicca per vedere i dettagli
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </p>
                </div>
            </div>
        </button>
    )
}

