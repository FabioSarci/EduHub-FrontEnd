import { Outlet } from "react-router-dom";
import LandingHeader from "./LandingHeader";
import Footer from "./Footer";

const Layout = () => {
    return (
        <>
            <LandingHeader />
            <Outlet />
            <Footer />
        </>
    );
};

export default Layout;
