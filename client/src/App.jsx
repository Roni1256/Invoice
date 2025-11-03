import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { axiosInstance } from "./utils/axiosInstance";
import ProtectedRoute from "./utils/ProtectedRoute";
import Authentication from "./pages/Authentication";
import Profile from "./pages/Profile";
import Hero from "./pages/Hero";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Verification from "./pages/Verification";
import Workspace from "./pages/Workspace";
import Clients from "./pages/Clients";
import Stocks from "./pages/Stocks";
import Startup from "./pages/Startup";
import Reports from "./pages/Reports";
import Invoices from "./pages/Invoices";
import CreateInvoice from "./pages/CreateInvoice";
import SendInvoice from "./pages/SendInvoice";

export const UserContext = createContext();
export const LoaderContext = createContext();
export const CompanyContext = createContext();

const App = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState();

  const navigate = useNavigate();

  async function getUser() {
    try {
      setLoading(true);
      const resp = await axiosInstance.get("/authentication/current-user");
      getCompanyDetails(resp.data.user._id);

      setUser(resp.data.user);
      setLoading(false);
      
    } catch (error) {
      setLoading(false);
      navigate("/");
    }
  }
  async function getCompanyDetails(userId) {
    try {
      const resp = await axiosInstance.get(`/company/${userId}`);
      setCompany(resp.data.data);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    getUser();

  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <LoaderContext.Provider value={[loading, setLoading]}>
        <CompanyContext.Provider value={[company, setCompany]}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/startup" element={<Startup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />}>
                <Route path="" element={<Home />} />
                <Route path="new-invoice" element={<CreateInvoice />} />
                <Route path="send-invoice" element={<SendInvoice/>}/>
                <Route path="workspace" element={<Workspace />} />
                <Route path="inventory" element={<Stocks />} />
                <Route path="clients" element={<Clients />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="reports" element={<Reports />} />
              </Route>
            </Route>
            <Route path="/" element={<Hero />} />
            <Route path="/authenticate" element={<Authentication />} />

            <Route path="/verify-account" element={<Verification />} />
          </Routes>
        </CompanyContext.Provider>
      </LoaderContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
