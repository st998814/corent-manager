import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";


// import routes lazily to optimize loading
const Home = lazy(() => import("../pages/Home"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const Request = lazy(() => import("../pages/Request"));
const Inventory = lazy(() => import("../pages/Inventory"));
const Election = lazy(() => import("../pages/Election"));
const Docs = lazy(() => import("../pages/Docs"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
 // Define the props for AppRoutes
interface AppRoutesProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}
// Main AppRoutes component
export default function AppRoutes({ setIsLoggedIn }: AppRoutesProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/profile" element={<Profile />} />
        <Route path='/request' element={<Request />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/election" element={<Election />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Signup />} />


        {/* Add more routes as needed */}
      </Routes>
    </Suspense>
  );
}