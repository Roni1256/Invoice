import React, { useState } from 'react';
import {
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  Calendar,
  Filter,
  Printer,
  Mail,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock,
  CheckCircle,
} from 'lucide-react';

const Reports = () => {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('overview');

  // Sample data - Replace with API data
  const metrics = {
    totalRevenue: 125000,
    revenueChange: 15.3,
    totalInvoices: 48,
    invoicesChange: 8.2,
    paidInvoices: 32,
    pendingInvoices: 12,
    overdueInvoices: 3,
    draftInvoices: 1,
    averageInvoiceValue: 2604.17,
    totalClients: 32,
    activeClients: 28,
    newClients: 5,
    topClient: 'Global Enterprises',
    topClientRevenue: 15000,
  };

  const revenueByMonth = [
    { month: 'Jan', revenue: 8500, invoices: 6 },
    { month: 'Feb', revenue: 12000, invoices: 8 },
    { month: 'Mar', revenue: 15000, invoices: 10 },
    { month: 'Apr', revenue: 11000, invoices: 7 },
    { month: 'May', revenue: 18000, invoices: 12 },
    { month: 'Jun', revenue: 22000, invoices: 15 },
  ];

  const topClients = [
    { name: 'Global Enterprises', revenue: 15000, invoices: 5, paid: 12000, pending: 3000 },
    { name: 'Acme Corporation', revenue: 12500, invoices: 8, paid: 12500, pending: 0 },
    { name: 'TechStart Inc', revenue: 9800, invoices: 6, paid: 7000, pending: 2800 },
    { name: 'Marketing Solutions', revenue: 8200, invoices: 4, paid: 5000, pending: 3200 },
    { name: 'Design Studio Pro', revenue: 6500, invoices: 5, paid: 5550, pending: 950 },
  ];

  const revenueByCategory = [
    { category: 'Consulting', amount: 45000, percentage: 36, color: 'bg-primary' },
    { category: 'Development', amount: 38000, percentage: 30.4, color: 'bg-success' },
    { category: 'Design', amount: 22000, percentage: 17.6, color: 'bg-warning' },
    { category: 'Support', amount: 15000, percentage: 12, color: 'bg-error' },
    { category: 'Other', amount: 5000, percentage: 4, color: 'bg-gray-400' },
  ];

  const inventoryStats = [
    { item: 'Total Items', value: 156, change: 12, color: 'text-primary' },
    { item: 'Low Stock Items', value: 8, change: -3, color: 'text-error' },
    { item: 'Total Value', value: '$45,200', change: 8, color: 'text-success' },
    { item: 'Categories', value: 12, change: 2, color: 'text-warning' },
  ];

  const handleExport = (format) => {
    console.log(`Exporting report as ${format}`);
    // Add export logic here
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    console.log('Email report');
    // Add email logic here
  };

  return (
    <div className="p-6">
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Reports & Analytics
            </h1>
            <p className="text-text-secondary">
              Track your business performance and insights
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>

            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleEmail}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
          </div>
        </div>
      </header>

      {/* Report Type Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['overview', 'revenue', 'invoices', 'clients', 'inventory'].map((type) => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              reportType === type
                ? 'bg-primary text-white'
                : 'bg-surface border border-border hover:bg-gray-50'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Report */}
      {reportType === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    metrics.revenueChange >= 0 ? 'text-success' : 'text-error'
                  }`}
                >
                  {metrics.revenueChange >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(metrics.revenueChange)}%
                </div>
              </div>
              <h3 className="text-text-secondary text-sm font-medium mb-1">
                Total Revenue
              </h3>
              <p className="text-3xl font-bold text-text-primary">
                ${metrics.totalRevenue.toLocaleString()}
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-success" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    metrics.invoicesChange >= 0 ? 'text-success' : 'text-error'
                  }`}
                >
                  {metrics.invoicesChange >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(metrics.invoicesChange)}%
                </div>
              </div>
              <h3 className="text-text-secondary text-sm font-medium mb-1">
                Total Invoices
              </h3>
              <p className="text-3xl font-bold text-text-primary">
                {metrics.totalInvoices}
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-warning" />
                </div>
                <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded">
                  +{metrics.newClients} new
                </span>
              </div>
              <h3 className="text-text-secondary text-sm font-medium mb-1">
                Total Clients
              </h3>
              <p className="text-3xl font-bold text-text-primary">
                {metrics.totalClients}
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-error" />
                </div>
              </div>
              <h3 className="text-text-secondary text-sm font-medium mb-1">
                Avg Invoice Value
              </h3>
              <p className="text-3xl font-bold text-text-primary">
                ${metrics.averageInvoiceValue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Revenue Trend Chart */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-xl font-bold text-text-primary mb-6">
              Revenue Trend
            </h2>
            <div className="space-y-4">
              {revenueByMonth.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-text-primary">
                      {item.month}
                    </span>
                    <span className="text-text-secondary">
                      {item.invoices} invoices
                    </span>
                    <span className="font-bold text-primary">
                      ${item.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${(item.revenue / 25000) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Clients & Revenue by Category */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Clients */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
              <h2 className="text-xl font-bold text-text-primary mb-6">
                Top Clients
              </h2>
              <div className="space-y-4">
                {topClients.map((client, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-primary/5 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">
                          {client.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {client.invoices} invoices
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">
                        ${client.revenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-text-secondary">
                        ${client.pending.toLocaleString()} pending
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue by Category */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
              <h2 className="text-xl font-bold text-text-primary mb-6">
                Revenue by Category
              </h2>
              <div className="space-y-4">
                {revenueByCategory.map((cat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-text-primary">
                        {cat.category}
                      </span>
                      <span className="text-text-secondary">
                        {cat.percentage}%
                      </span>
                      <span className="font-bold text-primary">
                        ${cat.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${cat.color} h-2 rounded-full transition-all`}
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Report */}
      {reportType === 'revenue' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Collected</p>
                  <p className="text-2xl font-bold text-success">
                    ${(metrics.totalRevenue * 0.75).toFixed(0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Pending</p>
                  <p className="text-2xl font-bold text-warning">
                    ${(metrics.totalRevenue * 0.2).toFixed(0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-error" />
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Overdue</p>
                  <p className="text-2xl font-bold text-error">
                    ${(metrics.totalRevenue * 0.05).toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-xl font-bold text-text-primary mb-6">
              Monthly Revenue Breakdown
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary/5 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                      Month
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">
                      Invoices
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">
                      Avg Value
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">
                      Growth
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {revenueByMonth.map((item, index) => {
                    const avgValue = item.revenue / item.invoices;
                    const growth =
                      index > 0
                        ? ((item.revenue - revenueByMonth[index - 1].revenue) /
                            revenueByMonth[index - 1].revenue) *
                          100
                        : 0;
                    return (
                      <tr key={index} className="hover:bg-primary/5">
                        <td className="px-4 py-3 font-medium text-text-primary">
                          {item.month}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-primary">
                          ${item.revenue.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-text-secondary">
                          {item.invoices}
                        </td>
                        <td className="px-4 py-3 text-right text-text-secondary">
                          ${avgValue.toFixed(0)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`inline-flex items-center gap-1 text-sm font-medium ${
                              growth >= 0 ? 'text-success' : 'text-error'
                            }`}
                          >
                            {growth >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {index > 0 ? `${Math.abs(growth).toFixed(1)}%` : '-'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Invoices Report */}
      {reportType === 'invoices' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-surface p-6 rounded-xl border border-success/20 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-8 h-8 text-success" />
                <div>
                  <p className="text-text-secondary text-sm">Paid</p>
                  <p className="text-2xl font-bold text-success">
                    {metrics.paidInvoices}
                  </p>
                </div>
              </div>
              <p className="text-xs text-text-secondary">
                {((metrics.paidInvoices / metrics.totalInvoices) * 100).toFixed(
                  1
                )}
                % of total
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-warning/20 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-8 h-8 text-warning" />
                <div>
                  <p className="text-text-secondary text-sm">Pending</p>
                  <p className="text-2xl font-bold text-warning">
                    {metrics.pendingInvoices}
                  </p>
                </div>
              </div>
              <p className="text-xs text-text-secondary">
                {(
                  (metrics.pendingInvoices / metrics.totalInvoices) *
                  100
                ).toFixed(1)}
                % of total
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-error/20 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-8 h-8 text-error" />
                <div>
                  <p className="text-text-secondary text-sm">Overdue</p>
                  <p className="text-2xl font-bold text-error">
                    {metrics.overdueInvoices}
                  </p>
                </div>
              </div>
              <p className="text-xs text-text-secondary">
                {(
                  (metrics.overdueInvoices / metrics.totalInvoices) *
                  100
                ).toFixed(1)}
                % of total
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-8 h-8 text-text-secondary" />
                <div>
                  <p className="text-text-secondary text-sm">Draft</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {metrics.draftInvoices}
                  </p>
                </div>
              </div>
              <p className="text-xs text-text-secondary">Not sent yet</p>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-xl font-bold text-text-primary mb-6">
              Invoice Status Distribution
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-success rounded"></div>
                      <span className="text-text-primary">Paid</span>
                    </div>
                    <span className="font-semibold">
                      {metrics.paidInvoices} (
                      {(
                        (metrics.paidInvoices / metrics.totalInvoices) *
                        100
                      ).toFixed(1)}
                      %)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-warning rounded"></div>
                      <span className="text-text-primary">Pending</span>
                    </div>
                    <span className="font-semibold">
                      {metrics.pendingInvoices} (
                      {(
                        (metrics.pendingInvoices / metrics.totalInvoices) *
                        100
                      ).toFixed(1)}
                      %)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-error rounded"></div>
                      <span className="text-text-primary">Overdue</span>
                    </div>
                    <span className="font-semibold">
                      {metrics.overdueInvoices} (
                      {(
                        (metrics.overdueInvoices / metrics.totalInvoices) *
                        100
                      ).toFixed(1)}
                      %)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gray-400 rounded"></div>
                      <span className="text-text-primary">Draft</span>
                    </div>
                    <span className="font-semibold">
                      {metrics.draftInvoices} (
                      {(
                        (metrics.draftInvoices / metrics.totalInvoices) *
                        100
                      ).toFixed(1)}
                      %)
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {/* Simple pie chart visualization */}
                  <div className="absolute inset-0 rounded-full border-8 border-success"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-text-primary">
                        {metrics.totalInvoices}
                      </p>
                      <p className="text-sm text-text-secondary">Total</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clients Report */}
      {reportType === 'clients' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-text-secondary text-sm">Total Clients</p>
                  <p className="text-2xl font-bold text-primary">
                    {metrics.totalClients}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
                <div>
                  <p className="text-text-secondary text-sm">Active Clients</p>
                  <p className="text-2xl font-bold text-success">
                    {metrics.activeClients}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-warning" />
                <div>
                  <p className="text-text-secondary text-sm">New This Month</p>
                  <p className="text-2xl font-bold text-warning">
                    {metrics.newClients}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-text-primary">
                Top Clients by Revenue
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">
                      Client Name
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-text-primary">
                      Total Revenue
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-text-primary">
                      Invoices
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-text-primary">
                      Paid
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-text-primary">
                      Pending
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topClients.map((client, index) => (
                    <tr key={index} className="hover:bg-primary/5">
                      <td className="px-6 py-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-bold">
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-text-primary">
                        {client.name}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-primary">
                        ${client.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-text-secondary">
                        {client.invoices}
                      </td>
                      <td className="px-6 py-4 text-right text-success">
                        ${client.paid.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-warning">
                        ${client.pending.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Report */}
      {reportType === 'inventory' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            {inventoryStats.map((stat, index) => (
              <div
                key={index}
                className="bg-surface p-6 rounded-xl border border-border shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Package className={`w-8 h-8 ${stat.color}`} />
                  <div>
                    <p className="text-text-secondary text-sm">{stat.item}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.change >= 0 ? 'text-success' : 'text-error'
                  }`}
                >
                  {stat.change >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(stat.change)}% from last month
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-xl font-bold text-text-primary mb-6">
              Inventory Insights
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <h4 className="font-semibold text-text-primary">
                      Well Stocked
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-success">148 items</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Above minimum stock level
                  </p>
                </div>

                <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-warning" />
                    <h4 className="font-semibold text-text-primary">
                      Reorder Soon
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-warning">5 items</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Approaching minimum level
                  </p>
                </div>

                <div className="p-4 bg-error/5 border border-error/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingDown className="w-5 h-5 text-error" />
                    <h4 className="font-semibold text-text-primary">
                      Low Stock
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-error">8 items</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Below minimum stock level
                  </p>
                </div>
              </div>

              <div className="p-6 bg-primary/5 rounded-lg">
                <h4 className="font-semibold text-text-primary mb-4">
                  Inventory Value Distribution
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Electronics</span>
                      <span className="font-semibold">$18,500</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: '41%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Accessories</span>
                      <span className="font-semibold">$12,200</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-success h-2 rounded-full"
                        style={{ width: '27%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Stationery</span>
                      <span className="font-semibold">$8,800</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-warning h-2 rounded-full"
                        style={{ width: '19%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Other</span>
                      <span className="font-semibold">$5,700</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-error h-2 rounded-full"
                        style={{ width: '13%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              Quick Actions
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <button className="p-4 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition text-left">
                <Package className="w-6 h-6 mb-2" />
                <p className="font-semibold">Restock Low Items</p>
                <p className="text-sm opacity-75">8 items need attention</p>
              </button>
              <button className="p-4 border-2 border-border hover:border-primary hover:text-primary rounded-lg hover:bg-primary/5 transition text-left">
                <BarChart3 className="w-6 h-6 mb-2" />
                <p className="font-semibold">View Full Report</p>
                <p className="text-sm opacity-75">Detailed inventory analytics</p>
              </button>
              <button className="p-4 border-2 border-border hover:border-primary hover:text-primary rounded-lg hover:bg-primary/5 transition text-left">
                <Download className="w-6 h-6 mb-2" />
                <p className="font-semibold">Export Data</p>
                <p className="text-sm opacity-75">Download as CSV or PDF</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Footer */}
      <div className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-text-primary mb-1">
              Report Generated
            </h3>
            <p className="text-sm text-text-secondary">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;