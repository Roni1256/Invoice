import React, { useContext, useState } from "react";
import {
  DollarSign,
  FileText,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Package,
  Eye,
  Send,
} from "lucide-react";
import { CompanyContext, UserContext } from "../App";
import { axiosInstance } from "../utils/axiosInstance";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // Sample data - Replace with API data
  const navigate=useNavigate()
  const [company, setCompany] = useContext(CompanyContext);
  const [user, setUser] = useContext(UserContext);
  const [clients, setClients] = useState();
  const [stats, setStats] = useState({
    totalRevenue: 125000,
    revenueChange: 12.5,
    totalInvoices: 48,
    invoicesChange: 8.2,
    totalClients: 32,
    clientsChange: 15.3,
    pendingAmount: 15500,
    pendingChange: -5.2,
  });

  const [recentInvoices, setRecentInvoices] = useState([]);

  const [recentActivities, setRecentActivities] = useState([]);

  const upcomingPayments = [
    {
      id: 1,
      client: "TechStart Inc",
      amount: 1800,
      dueDate: "2024-02-19",
      daysLeft: 3,
    },
    {
      id: 2,
      client: "Marketing Solutions",
      amount: 3200,
      dueDate: "2024-02-21",
      daysLeft: 5,
    },
    {
      id: 3,
      client: "Global Enterprises",
      amount: 5500,
      dueDate: "2024-02-24",
      daysLeft: 8,
    },
  ];

  const statusConfig = {
    paid: { label: "Paid", color: "text-success bg-success/10" },
    pending: { label: "Pending", color: "text-warning bg-warning/10" },
    overdue: { label: "Overdue", color: "text-error bg-error/10" },
    draft: { label: "Draft", color: "text-text-secondary bg-gray-100" },
  };

  const quickActions = [
    {
      title: "Create Invoice",
      description: "Generate a new invoice",
      icon: Plus,
      color: "bg-primary",
      action: () => navigate("/dashboard/new-invoice"),
    },    {
      title: "Add Client",
      description: "Register new client",
      icon: Users,
      color: "bg-success",
      action: () => navigate("/dashboard/clients"),
    },
    {
      title: "Add Inventory",
      description: "Add stock items",
      icon: Package,
      color: "bg-warning",
      action: () => navigate("/dashboard/inventory"),
    },
  ];

  function calcAgo(time) {
    const now = new Date();
    const past = new Date(time);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
  }

  async function getStatus() {
    try {
      const resp = (await axiosInstance.get(`/general/${company._id}`)).data.generalStatus;
      
      const status = {
        totalRevenue:resp.totalRevenue,
        revenueChange:resp.revenueChange,
        totalInvoices: resp.totalInvoices,
        invoicesChange:resp.invoiceChange,
        totalClients: resp.totalClients,
        clientsChange: resp.clientsChange,
        pendingAmount: resp.totalPending,
        pendingChange: -5.2,
      };
      // console.log(resp);
      
      setStats(status)
    } catch (error) {
      console.log(error);
    }
  }

  async function getAllActivities() {
    try {
      const { data } = await axiosInstance.get(`/activities/${company._id}`);
      const formatted = data.activities.map((activity) => ({
        id: activity._id,
        action: activity.action,
        description: activity.description,
        time: calcAgo(activity.time),
      }));
      setRecentActivities(formatted.reverse()); // ✅ replaces instead of appending
    } catch (error) {
      console.log(error);
    }
  }

  async function getInvoices() {
    try {
      const { data } = await axiosInstance.get(`/invoice/${company._id}`);
      const invoices = data.invoices;

      // Use Promise.all to resolve all async client requests
      const formattedInvoices = await Promise.all(
        invoices.map(async (inv, i) => {
          const clientRes = await axiosInstance.get(
            `/client/details/${inv.clientId}`
          );
          const client = clientRes.data.client;

          return {
            id: i,
            invoiceNumber: inv.invoiceNumber,
            client: client?.company || "",
            amount: inv.amount,
            status: inv.status,
            dueDate: inv.dueDate,
          };
        })
      );

      setRecentInvoices(formattedInvoices);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  }
  async function getUpcomingPayments(){
    try {
      const {data}=await axiosInstance.get(`/general/upcoming-payments/${company._id}`);
      console.log(data);
      
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() => {
    getAllActivities();
    getInvoices();
    getStatus();
    getUpcomingPayments();
  }, []);
  return (
    <div className="p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-text-secondary">
          Here's what's happening with your business today
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                stats.revenueChange >= 0 ? "text-success" : "text-error"
              }`}
            >
              {stats.revenueChange >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(stats.revenueChange)}%
            </div>
          </div>
          <h3 className="text-text-secondary text-sm font-medium mb-1">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-text-primary">
            ${stats.totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-text-secondary mt-2">
            +${((stats.totalRevenue * stats.revenueChange) / 100).toFixed(0)}{" "}
            from last month
          </p>
        </div>

        {/* Total Invoices */}
        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-success" />
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                stats.invoicesChange >= 0 ? "text-success" : "text-error"
              }`}
            >
              {stats.invoicesChange >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(stats.invoicesChange)}%
            </div>
          </div>
          <h3 className="text-text-secondary text-sm font-medium mb-1">
            Total Invoices
          </h3>
          <p className="text-3xl font-bold text-text-primary">
            {stats.totalInvoices}
          </p>
          <p className="text-xs text-text-secondary mt-2">This month</p>
        </div>

        {/* Total Clients */}
        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-warning" />
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                stats.clientsChange >= 0 ? "text-success" : "text-error"
              }`}
            >
              {stats.clientsChange >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(stats.clientsChange)}%
            </div>
          </div>
          <h3 className="text-text-secondary text-sm font-medium mb-1">
            Total Clients
          </h3>
          <p className="text-3xl font-bold text-text-primary">
            {stats.totalClients}
          </p>
          <p className="text-xs text-text-secondary mt-2">Active clients</p>
        </div>

        {/* Pending Amount */}
        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-error" />
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                stats.pendingChange >= 0 ? "text-success" : "text-error"
              }`}
            >
              {stats.pendingChange >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(stats.pendingChange)}%
            </div>
          </div>
          <h3 className="text-text-secondary text-sm font-medium mb-1">
            Pending Amount
          </h3>
          <p className="text-3xl font-bold text-text-primary">
            ${stats.pendingAmount.toLocaleString()}
          </p>
          <p className="text-xs text-text-secondary mt-2">Awaiting payment</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="bg-surface p-6 rounded-xl border border-border hover:shadow-md transition text-left group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border shadow-sm">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">
              Recent Invoices
            </h2>
            <button className="text-primary hover:text-primary-dark text-sm font-medium">
              View All
            </button>
          </div>
          <div className="divide-y divide-border">
            {recentInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="p-4 hover:bg-primary/5 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-text-primary">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {invoice.client}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-text-primary">
                      ${invoice.amount}
                    </p>
                    <p className="text-xs text-text-secondary">
                      Due {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      statusConfig[invoice.status].color
                    }`}
                  >
                    {statusConfig[invoice.status].label}
                  </span>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-primary/10 rounded-lg transition">
                      <Eye className="w-4 h-4 text-primary" />
                    </button>
                    <button className="p-2 hover:bg-primary/10 rounded-lg transition">
                      <Send className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="bg-surface rounded-xl border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-text-primary">
              Upcoming Payments
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {upcomingPayments.map((payment) => (
              <div
                key={payment.id}
                className="p-4 bg-primary/5 rounded-lg border border-primary/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-text-primary">
                    {payment.client}
                  </p>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {payment.daysLeft} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-primary">
                    ${payment.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-text-secondary flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(payment.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-surface rounded-xl border border-border shadow-sm">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-4">
                {/* <div
                  className={`w-10 h-10 ${
                    activity.color === "text-primary"
                      ? "bg-primary/10"
                      : activity.color === "text-success"
                      ? "bg-success/10"
                      : "bg-error/10"
                  } rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div> */}
                <div className="flex-1">
                  <p className="font-medium text-text-primary">
                    {activity.action}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-text-secondary whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
