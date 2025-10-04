import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import Proyect from "./pages/proyect.jsx";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Login from "./pages/login/Login.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    children:[
      {
        path: '/',
        element: <Proyect/>
      }
    ]
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
