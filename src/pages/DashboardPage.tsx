import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {

  const {user} = useAuth();

  return (
    <>
      <div className="content pt-2">
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CourseCard subject="React/Typescript" course="View and manage your enrolled courses" teacher="Manuel di Campli" id="1"/>
          <CourseCard subject="Java" course="Check your upcoming and past assignments" teacher="Davide Fella" id="1"/>
          <CourseCard subject="DevOps" course="Monitor your academic performance" teacher="Bruno" id="1"/>
        </div>
      </div>
    </>
  )
}

function CourseCard({ subject, course, teacher, id}: { subject: string; course: string; teacher: string, id:string }) {
  const navigate = useNavigate()
  return (
    <button onClick={() =>{navigate(`/course/${id}`)}}>
        <div className="flex flex-col p-4 bg-white shadow-lg rounded-2xl border border-cyan-500">
        <h2 className="text-2xl font-bold text-cyan-700">{subject}</h2>
        <p className="text-cyan-600">{course}</p>
        <p className="text-xs mt-4">{teacher}</p>
      </div>
    </button>
  )
}

