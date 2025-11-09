import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Login from "./pages/login/Login.jsx";
import Reports from "./pages/reports/Reports.jsx";
import ProyectList from "./pages/proyectlist/ProyectList.jsx";
import Proyect from "./pages/proyect/Proyect.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import Sidebar from "./sidebar/Sidebar.jsx";
import CreateProyect from "./pages/createProyect/createProyect.jsx";


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
        path: '/proyectslist',
        element: <ProyectList/>
      },
      {
        path: '/proyectslist/proyect/:id',
        element: <Proyect/>
      },
      {
        path: '/proyectslist/proyect/create',
        element: <CreateProyect/>
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
