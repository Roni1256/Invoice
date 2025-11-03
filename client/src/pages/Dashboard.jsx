import React, { createContext, use, useContext, useEffect, useState } from "react";
import { CompanyContext, UserContext } from "../App";
import { axiosInstance } from "../utils/axiosInstance";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  ClipboardMinus,
  House,
  icons,
  PackageOpen,
  ReceiptText,
  Users,
} from "lucide-react";
import { MdInventory } from "react-icons/md";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useContext(UserContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(window.location.pathname.split("/")[2] || "Home");
  const [showMenuName, setMenuName] = useState(true);
  const [company,setCompany]=useContext(CompanyContext)
  const links = [
    { name: "Home", path: "", icon: <House /> },
    { name: "Workspace", path: "workspace", icon: <BriefcaseBusiness /> },
    { name: "Inventory", path: "inventory", icon: <PackageOpen /> },
    { name: "Clients", path: "clients", icon: <Users /> },
    { name: "Invoices", path: "invoices", icon: <ReceiptText /> },
    { name: "Reports", path: "reports", icon: <ClipboardMinus /> },
  ];
  async function logout() {
    try {
      await axiosInstance.get("/authentication/logout");
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }
  

  
  return (
    <div>
      <header className="flex items-center justify-between px-10 py-3 border-b border-gray-300">
        <div className="flex items-center gap-4">
          <img src="logo.png" alt="logo" className="w-1/5" />
          <h1 className="text-2xl lg:text-3xl text-primary-dark">{company?.companyName || "Billing"}</h1>
        </div>
        <div className="">
          <button
            className={`text-2xl rounded-full p-2 button-secondary-reverse ring ring-primary/40 flex items-center justify-center hover:bg-primary-dark hover:text-white ${
              isProfileOpen
                ? "bg-primary text-white"
                : "bg-border text-primary-dark"
            }`}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            {user.username[0]}
          </button>
          <div className="">
            {isProfileOpen && (
              <div className="absolute right-10 mt-2   bg-white border border-border rounded-lg shadow-lg p-5">
                <div className=" border-b border-border">
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="w-full py-3">
                  <button
                    className="button-danger w-full"
                    onClick={() => {
                      logout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex item-center h-full">
        <section className="w-fit p-5 border-r border-gray-300  relative">
          <button
            className="absolute bottom-10 -right-6 button-secondary-reverse bg-border text-text-primary rounded-xl border border-primary-light flex items-center justify-center "
            onClick={() => setMenuName(!showMenuName)}
          >
            {showMenuName ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
          {showMenuName && (
            <span className="text-lg   text-gray-400">Business Management</span>
          )}
          <nav className="mt-3 flex flex-col gap-2 relative">
            {links.map((link, index) => (
              <Link
                key={index}
                className={`button-secondary-reverse  md:text-lg  text-start flex items-center gap-4 rounded-xl ${
                  currentPage.toLowerCase() === link.name.toLowerCase()
                    ? "bg-border text-primary-dark ring ring-primary/40"
                    : "bg-surface text-primary-dark ring-0 "
                }`}
                onClick={() => setCurrentPage(link.name)}
                to={link.path}
              >
                {link.icon}
                {showMenuName && <span>{link.name}</span>}
              </Link>
            ))}
          </nav>
        </section>
        <section className="w-full p-10 bg-background h-[90vh] overflow-auto scrollbar-hide">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
