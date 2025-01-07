import { Link } from "react-router-dom"

const Footer = () =>{

    return (
        <footer className="border-t border-cyan-300 bg-cyan-50">
        <div className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
          <p className="text-xs text-cyan-700">© 2023 EduHub. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs text-cyan-700 hover:underline underline-offset-4" to="#">
              Terms of Service
            </Link>
            <Link className="text-xs text-cyan-700 hover:underline underline-offset-4" to="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    )
}

export default Footer;