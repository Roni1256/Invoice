
import React, { useState } from 'react';
import {
  Send,
  ArrowLeft,
  Mail,
  Plus,
  X,
  Eye,
  FileText,
  Calendar,
  User,
  Copy,
  CheckCircle,
  Paperclip,
  AlertCircle,
} from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const SendInvoice = () => {
  const navigate=useNavigate()
  const location=useLocation()
  const data=location.state.data
  console.log(data);
  
  // Sample invoice data - This would come from props or route state
  const     invoice = {
    id: 1,
    invoiceNumber: data.invoiceNumber,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    issueDate: data.issueDate,
    dueDate: data.dueDate,
    amount: data.amount,
    status: data.status,
    items: data.items,
  };

  const [emailData, setEmailData] = useState({
    to: invoice.clientEmail,
    cc: '',
    bcc: '',
    subject: `Invoice ${invoice.invoiceNumber} from Your Company`,
    message: `Dear ${invoice.clientName},

    Please find attached invoice ${invoice.invoiceNumber} for the amount of $${invoice.amount.toFixed(2)}.
    Payment is due by ${new Date(invoice.dueDate).toLocaleDateString()}.
    If you have any questions about this invoice, please contact us.

    Thank you for your business!


  Best regards,
  Your Company Name`,
  });

  const [ccRecipients, setCcRecipients] = useState([]);
  const [bccRecipients, setBccRecipients] = useState([]);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [attachments, setAttachments] = useState(['invoice-pdf']);
  const [sendCopy, setSendCopy] = useState(true);
  const [scheduleEmail, setScheduleEmail] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData({
      ...emailData,
      [name]: value,
    });
  };

  const addCcRecipient = () => {
    if (emailData.cc && emailData.cc.includes('@')) {
      setCcRecipients([...ccRecipients, emailData.cc]);
      setEmailData({ ...emailData, cc: '' });
    }
  };

  const addBccRecipient = () => {
    if (emailData.bcc && emailData.bcc.includes('@')) {
      setBccRecipients([...bccRecipients, emailData.bcc]);
      setEmailData({ ...emailData, bcc: '' });
    }
  };

  const removeCcRecipient = (email) => {
    setCcRecipients(ccRecipients.filter((e) => e !== email));
  };

  const removeBccRecipient = (email) => {
    setBccRecipients(bccRecipients.filter((e) => e !== email));
  };

  const handleSendInvoice = async () => {
    setIsSending(true);
    
    // Simulate sending
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSendSuccess(false);
        // Navigate back or to invoices list
        console.log('Navigate to invoices list');
      }, 3000);
    }, 2000);

    const emailPayload = {
      ...emailData,
      cc: ccRecipients,
      bcc: bccRecipients,
      invoice: invoice,
      sendCopy: sendCopy,
      scheduled: scheduleEmail ? `${scheduledDate} ${scheduledTime}` : null,
    };

    console.log('Sending invoice:', emailPayload);
    // Add your send email API call here
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <header className="mb-6">
        <button className="flex items-center gap-2 text-text-secondary hover:text-primary transition mb-4" 
        onClick={()=>navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Invoices</span>
        </button>
<div className=" inset-0 flex items-center justify-center z-50 overflow-y-auto">
                <div className="bg-surface rounded-2xl  max-w-4xl w-full my-8">
                  <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-text-primary">
                      Invoice Preview
                    </h2>
                    
                  </div>
      
                  <div className="p-8 space-y-6">
                    {/* Preview content similar to invoice details modal */}
                    <div className="flex justify-between items-start pb-6 border-b border-border">
                      <div>
                        <h3 className="text-3xl font-bold text-text-primary mb-2">
                          {data.invoiceNumber}
                        </h3>
                        <p className="text-text-secondary">
                          Issue Date:{" "}
                          {new Date(data.issueDate).toLocaleDateString()}
                        </p>
                        <p className="text-text-secondary">
                          Due Date:{" "}
                          {data.dueDate
                            ? new Date(data.dueDate).toLocaleDateString()
                            : "Not set"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-text-secondary text-sm mb-1">
                          Total Amount
                        </p>
                        <p className="text-3xl font-bold text-primary">
                          ${data.amount}
                        </p>
                      </div>
                    </div>
      
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-text-primary mb-3">
                          Bill To
                        </h4>
                        <p className="font-medium text-text-primary">
                          {data.clientName || "Client Name"}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {data.clientEmail || "client@example.com"}
                        </p>
                        {invoice.clientAddress && (
                          <p className="text-sm text-text-secondary mt-2">
                            {data.clientAddress}
                            {data.clientCity && `, ${data.clientCity}`}
                            {data.clientState && `, ${data.clientState}`}
                            {data.clientZip && ` ${data.clientZip}`}
                          </p>
                        )}
                      </div>
                    </div>
      
                    <div>
                      <h4 className="font-semibold text-text-primary mb-3">Items</h4>
                      <div className="border border-border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-primary/5">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                                Description
                              </th>
                              <th className="px-4 py-3 text-center text-sm font-semibold text-text-primary">
                                Qty
                              </th>
                              <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">
                                Rate
                              </th>
                              <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {data.items.map((item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-3 text-text-primary">
                                  {item.description || "Item description"}
                                </td>
                                <td className="px-4 py-3 text-center text-text-secondary">
                                  {item.quantity}
                                </td>
                                <td className="px-4 py-3 text-right text-text-secondary">
                                  ${parseFloat(item.rate).toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-right font-medium text-text-primary">
                                  ${item.amount.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
      
                    <div className="flex justify-end">
                      <div className="w-64 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Subtotal:</span>
                          <span className="font-medium">
                            {/* ${calculateSubtotal().toFixed(2)} */}
                          </span>
                        </div>
                        {data.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">
                              Discount{" "}
                              {data.discountType === "percentage"
                                ? `(${data.discount}%)`
                                : ""}
                              :
                            </span>
                            <span className="font-medium text-success">
                              {/* -${calculateDiscount().toFixed(2)} */}
                            </span>
                          </div>
                        )}
                        {data.taxRate > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">
                              Tax ({data.taxRate}%):
                            </span>
                            <span className="font-medium">
                              {/* ${calculateTax().toFixed(2)} */}
                            </span>
                          </div>
                        )}
                        {data.shipping > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Shipping:</span>
                            <span className="font-medium">
                              ${parseFloat(data.shipping).toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-border">
                          <span className="font-semibold text-text-primary">
                            Total:
                          </span>
                          <span className="text-xl font-bold text-primary">
                            ${data.amount}
                          </span>
                        </div>
                      </div>
                    </div>
      
                    {data.notes && (
                      <div>
                        <h4 className="font-semibold text-text-primary mb-2">
                          Notes
                        </h4>
                        <p className="text-sm text-text-secondary bg-gray-50 p-3 rounded-lg">
                          {formData.notes}
                        </p>
                      </div>
                    )}
      
                    {data.terms && (
                      <div>
                        <h4 className="font-semibold text-text-primary mb-2">
                          Terms & Conditions
                        </h4>
                        <p className="text-sm text-text-secondary bg-gray-50 p-3 rounded-lg">
                          {data.terms}
                        </p>
                      </div>
                    )}
      
                    
                  </div>
                </div>
              </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Send Invoice
            </h1>
            <p className="text-text-secondary">
              Compose and send invoice {data.invoiceNumber} to your client
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition flex items-center gap-2 font-medium"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={handleSendInvoice}
              disabled={isSending || sendSuccess}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : sendSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Sent!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Invoice
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {sendSuccess && (
        <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-success" />
          <div>
            <p className="font-semibold text-success">Invoice sent successfully!</p>
            <p className="text-sm text-text-secondary">
              The invoice has been sent to {invoice.clientEmail}
            </p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Email Composer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Email Form */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Details
            </h2>

            <div className="space-y-4">
              {/* To */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  To *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                  <input
                    type="email"
                    name="to"
                    required
                    value={emailData.to}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="client@example.com"
                  />
                </div>
              </div>

              {/* Cc */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-text-primary">
                    Cc
                  </label>
                  {!showCc && (
                    <button
                      onClick={() => setShowCc(true)}
                      className="text-xs text-primary hover:text-primary-dark"
                    >
                      Add Cc
                    </button>
                  )}
                </div>

                {showCc && (
                  <>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="email"
                        name="cc"
                        value={emailData.cc}
                        onChange={handleInputChange}
                        onKeyPress={(e) => e.key === 'Enter' && addCcRecipient()}
                        className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="cc@example.com"
                      />
                      <button
                        onClick={addCcRecipient}
                        className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {ccRecipients.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {ccRecipients.map((email, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {email}
                            <button
                              onClick={() => removeCcRecipient(email)}
                              className="hover:text-error"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Bcc */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-text-primary">
                    Bcc
                  </label>
                  {!showBcc && (
                    <button
                      onClick={() => setShowBcc(true)}
                      className="text-xs text-primary hover:text-primary-dark"
                    >
                      Add Bcc
                    </button>
                  )}
                </div>

                {showBcc && (
                  <>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="email"
                        name="bcc"
                        value={emailData.bcc}
                        onChange={handleInputChange}
                        onKeyPress={(e) => e.key === 'Enter' && addBccRecipient()}
                        className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="bcc@example.com"
                      />
                      <button
                        onClick={addBccRecipient}
                        className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {bccRecipients.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {bccRecipients.map((email, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {email}
                            <button
                              onClick={() => removeBccRecipient(email)}
                              className="hover:text-error"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={emailData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Invoice subject"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows="12"
                  value={emailData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Email message body..."
                />
                <p className="text-xs text-text-secondary mt-1">
                  Tip: Personalize your message to improve client relationships
                </p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Options</h2>

            <div className="space-y-4">
              {/* Send Copy */}
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Copy className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-text-primary">
                      Send me a copy
                    </p>
                    <p className="text-sm text-text-secondary">
                      Receive a copy of this email
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendCopy}
                    onChange={(e) => setSendCopy(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Schedule Email */}
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-text-primary">
                        Schedule send
                      </p>
                      <p className="text-sm text-text-secondary">
                        Send this invoice later
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scheduleEmail}
                      onChange={(e) => setScheduleEmail(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {scheduleEmail && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-xl border border-border shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Invoice Summary
            </h2>

            <div className="space-y-4">
              {/* Invoice Number */}
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-text-secondary mb-1">Invoice Number</p>
                <p className="text-xl font-bold text-primary">
                  {invoice.invoiceNumber}
                </p>
              </div>

              {/* Client Info */}
              <div>
                <p className="text-sm font-medium text-text-secondary mb-2">
                  Client
                </p>
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-text-secondary" />
                  <p className="font-medium text-text-primary">
                    {invoice.clientName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-text-secondary" />
                  <p className="text-sm text-text-secondary">
                    {invoice.clientEmail}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-text-secondary mb-1">Issue Date</p>
                  <p className="text-sm font-medium text-text-primary">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-1">Due Date</p>
                  <p className="text-sm font-medium text-text-primary">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-text-secondary mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-primary">
                  ${invoice.amount.toFixed(2)}
                </p>
              </div>

              {/* Attachment */}
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium text-text-primary mb-3">
                  Attachment
                </p>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-border">
                  <Paperclip className="w-4 h-4 text-text-secondary" />
                  <span className="text-sm text-text-primary">
                    {invoice.invoiceNumber}.pdf
                  </span>
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-text-secondary">
                    Make sure all invoice details are correct before sending. The
                    client will receive this email immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-3xl w-full my-8">
            <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-text-primary">
                Email Preview
              </h2>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              <div className="border border-border rounded-lg p-6 bg-gray-50">
                {/* Email Header */}
                <div className="mb-6 pb-4 border-b border-border">
                  <p className="text-sm text-text-secondary mb-1">
                    <strong>From:</strong> your-company@example.com
                  </p>
                  <p className="text-sm text-text-secondary mb-1">
                    <strong>To:</strong> {emailData.to}
                  </p>
                  {ccRecipients.length > 0 && (
                    <p className="text-sm text-text-secondary mb-1">
                      <strong>Cc:</strong> {ccRecipients.join(', ')}
                    </p>
                  )}
                  <p className="text-sm text-text-primary font-semibold mt-3">
                    {emailData.subject}
                  </p>
                </div>

                {/* Email Body */}
                <div className="whitespace-pre-wrap text-text-primary mb-6">
                  {emailData.message}
                </div>

                {/* Attachment */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium text-text-secondary mb-2">
                    Attachment:
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg">
                    <Paperclip className="w-4 h-4 text-primary" />
                    <span className="text-sm text-text-primary">
                      {invoice.invoiceNumber}.pdf
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    handleSendInvoice();
                  }}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendInvoice;