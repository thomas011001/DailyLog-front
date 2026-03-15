import { createBrowserRouter } from "react-router-dom";
import { SignUp } from "./routes/SignUp";
import { Login } from "./routes/Login";
import { Main } from "./routes/Main";
import { DayPage } from "./routes/DayPage";
import { Home } from "./routes/Home";

export const route = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Main />,
    children: [
      { index: true, element: <Home /> },
      { path: "day/:id", element: <DayPage /> },
    ],
  },
]);
