import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Sidebar from "./sidebar/Sidebar.jsx";
import Login from "./pages/login/Login.jsx";
import Reports from "./pages/reports/Reports.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import Customer from "./pages/customer/Customer.jsx";
import Project from "./pages/project/Project.jsx";
import CreateProject from "./pages/createProject/CreateProject.jsx";
import ProjectList from "./pages/proyectlist/Project.jsx";
import { AuthProvider } from "./components/authContext/AuthContext.jsx";
import ProjectHistoryPage from "./pages/projectHistoryPage/ProjectHistoryPage.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Sidebar />
      </PrivateRoute>
    ),
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/projectslist", element: <ProjectList /> },
      { path: "/projectslist/:idProject", element: <Project /> },
      { path: "/projectslist/project/create", element: <CreateProject /> },
      { path: "/projectslist/history/:idProject", element: <ProjectHistoryPage /> },

      { path: "/customers", element: <Customer /> },
      { path: "/reports", element: <Reports /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);

