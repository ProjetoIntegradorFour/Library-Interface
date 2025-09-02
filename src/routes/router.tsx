import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/dashboard/dashboard";
import Login from "../pages/login/login";

export const router = createBrowserRouter([
    {
    path: "/",
    element: <Dashboard />,
    },
    
    {
    path: "/login",
    element: <Login />,
    },
]);
