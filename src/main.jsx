import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Login from "./pages/login/Login.jsx";
import Reports from "./pages/reports/Reports.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import Sidebar from "./sidebar/Sidebar.jsx";
import Customer from "./pages/customer/Customer.jsx";
import Project from "./pages/project/Project.jsx";
import CreateProject from "./pages/createProject/CreateProject.jsx";
import ProjectList from "./pages/proyectlist/Project.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Sidebar />,
    children:[
      {
        path: '/',
        element: <HomePage/>
      },
      {
        path: '/projectslist',
        element: <ProjectList/>
      },
      {
        path: '/projectslist/:idProject',
        element: <Project/>
      },
      {
        path: '/projectslist/project/create',
        element: <CreateProject/>
      },
      {
        path: '/customers',
        element: <Customer/>
      },
      {
        path: '/reports',
        element: <Reports/>
      }
    ]
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
