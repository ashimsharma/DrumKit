import Footer from "./Footer.jsx";
import NavBar from "./NavBar.jsx";

export default function Layout({children}){
    return(
        <>
            <NavBar />
            {children}
            <Footer />
        </>
    )
}