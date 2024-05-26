import { Suspense } from "react";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const Signup = React.lazy(() => import("./pages/Signup"));
const Signin = React.lazy(() => import("./pages/Signin"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Root = React.lazy(()=> import("./pages/Root")); 
const Send = React.lazy(() => import("./pages/Send"));
export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback="loading">
                <Root />
              </Suspense>
            }
          ></Route>
          <Route
            path="signup"
            element={
              <Suspense fallback={"loading"}>
                <Signup />
              </Suspense>
            }
          ></Route>
          <Route
            path="signin"
            element={
              <Suspense fallback={"loading"}>
                <Signin />
              </Suspense>
            }
          ></Route>
          <Route
            path="dashboard"
            element={
              <Suspense fallback={"loading"}>
                <Dashboard />
              </Suspense>
            }
          ></Route>
          <Route
            path="send"
            element={
              <Suspense fallback={"loading"}>
                <Send />
              </Suspense>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
