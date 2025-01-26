import React from "react";
import { Route, Routes } from "react-router-dom";
import OnlyWithoutAuthRoute from "./components/OnlyWithoutAuthRoute/OnlyWithoutAuthRoute";
import RequireAuthRoute from "./components/RequireAuthRoute/RequireAuthRoute";
import Login from "../../screens/Login/Login";
import Layout from "../Layout/Layout";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/login"
          element={
            <OnlyWithoutAuthRoute>
              <Login />
            </OnlyWithoutAuthRoute>
          }
        />

        <Route
          path="/"
          element={<RequireAuthRoute>DASHBOARD</RequireAuthRoute>}
        />
      </Route>
    </Routes>
  );
};

export default AppRouter;
