import { Link } from "react-router-dom"
import { BookOpen } from "lucide-react"


const LandingHeader = () =>{

    return(
      <header className="z-40 px-4 lg:px-6 h-14 flex items-center border-b border-cyan-200 bg-white top-0 left-0 w-full fixed">
      <Link to="/" className="flex items-center justify-center">
        <BookOpen className="h-6 w-6 text-cyan-800" />
        <span className="ml-2 text-2xl font-bold text-cyan-800">EduHub</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link to="#" className="text-sm font-medium text-cyan-800 hover:text-cyan-900">
          Features
        </Link>
        <Link to="#" className="text-sm font-medium text-cyan-800 hover:text-cyan-900">
          Pricing
        </Link>
        <Link to="#" className="text-sm font-medium text-cyan-800 hover:text-cyan-900">
          About
        </Link>
        <Link to="#" className="text-sm font-medium text-cyan-800 hover:text-cyan-900">
          Contact
        </Link>
      </nav>
    </header>
    )

}

export default LandingHeader;