import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Login from "./pages/login/Login.jsx";
import Reports from "./pages/reports/Reports.jsx";
import ProyectList from "./pages/proyectlist/ProyectList.jsx";
import Home from "./pages/Home/Home.jsx";
import Proyect from "./pages/proyect/Proyect.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children:[
      {
        path: '/',
        element: <Home/>
      },
      {
        path: '/proyectslist',
        element: <ProyectList/>
      },
      {
        path: '/proyect/:id',
        element: <Proyect/>
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
