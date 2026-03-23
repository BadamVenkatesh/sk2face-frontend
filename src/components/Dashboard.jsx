
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

// Dashboard layout component
// Wraps every page with the common Navbar + Footer
// The actual page content is passed as {children}
// activeMenu is passed from each page to highlight the correct nav link
const Dashboard = ({ children}) => {
    return (
        <div className="min-h-screen flex flex-col bg-[#f0f1f3]">

            {/* Top Navbar — receives activeMenu to highlight the active link */}
            <Navbar />

            {/* Main content area — grows to fill available space between navbar & footer */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-8">
                {children}
            </main>

            {/* Footer — always sticks at the bottom */}
            <Footer />
        </div>
    );
};

export default Dashboard;