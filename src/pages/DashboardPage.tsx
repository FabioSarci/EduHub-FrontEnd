import { useAuth } from "@/contexts/AuthContext";
import { useCourseContext } from "@/contexts/CourseContext";
import { ICourseProps } from "@/interfaces/Course";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    <button onClick={() =>{navigate(`/course/${id}`)}}>
        <div className="flex flex-col p-4 bg-white shadow-lg rounded-2xl border border-cyan-500">
        <h2 className="text-2xl font-bold text-cyan-700">{subject}</h2>
        <p className="text-cyan-600">{course}</p>
        <p className="text-xs mt-4">{section}</p>
      </div>
    </button>
  )
}

