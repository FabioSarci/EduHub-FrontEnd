import { useAuth } from "@/contexts/AuthContext";
import { useCourseContext } from "@/contexts/CourseContext";
import { ICourseProps } from "@/interfaces/Course";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {

  const {user} = useAuth()
  const {usercourses, getCourses} = useCourseContext();
  const [courses, setCourses] = useState<ICourseProps[]>();
  const token = localStorage.getItem("ACCESS_TOKEN");

  useEffect(() =>{
    const token = localStorage.getItem("ACCESS_TOKEN");
    if(token && user?.id){
      getCourses(token,user?.id)
      console.log(usercourses);
    }
    
  },[])

  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (usercourses) {
        usercourses.forEach((course) => {
            axios
                .get(`http://localhost:7001/course/${course.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(({ data }) => {
                    setCourses((prevCourses =[]) => [...prevCourses, data]);
                })
                .catch((err) => console.error("Error fetching course:", err));
        });
    }
}, [usercourses]);

  

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

