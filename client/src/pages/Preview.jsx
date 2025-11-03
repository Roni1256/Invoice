import { Send, X } from "lucide-react";
import React from "react";

const Preview = ({ formData,setShowPreview }) => {
  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (formData.discountType === "percentage") {
      return (subtotal * parseFloat(formData.discount || 0)) / 100;
    }
    return parseFloat(formData.discount || 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return ((subtotal - discount) * parseFloat(formData.taxRate || 0)) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    const shipping = parseFloat(formData.shipping || 0);
    return subtotal - discount + tax + shipping;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-surface rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-text-primary">
            Invoice Preview
          </h2>
          <button
            onClick={() => setShowPreview("")}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Preview content similar to invoice details modal */}
          <div className="flex justify-between items-start pb-6 border-b border-border">
            <div>
              <h3 className="text-3xl font-bold text-text-primary mb-2">
                {formData.invoiceNumber}
              </h3>
              <p className="text-text-secondary">
                Issue Date: {new Date(formData.issueDate).toLocaleDateString()}
              </p>
              <p className="text-text-secondary">
                Due Date:{" "}
                {formData.dueDate
                  ? new Date(formData.dueDate).toLocaleDateString()
                  : "Not set"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-text-secondary text-sm mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-primary">
                ${calculateTotal().toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-text-primary mb-3">Bill To</h4>
              <p className="font-medium text-text-primary">
                {formData.clientName || "Client Name"}
              </p>
              <p className="text-sm text-text-secondary">
                {formData.clientEmail || "client@example.com"}
              </p>
              {formData.clientAddress && (
                <p className="text-sm text-text-secondary mt-2">
                  {formData.clientAddress}
                  {formData.clientCity && `, ${formData.clientCity}`}
                  {formData.clientState && `, ${formData.clientState}`}
                  {formData.clientZip && ` ${formData.clientZip}`}
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
                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-text-primary">
                        {item.description || "Item description"}
                      </td>
                      <td className="px-4 py-3 text-center text-text-secondary">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-text-secondary">
                        ${parseFloat(item.amount).toFixed(2)}
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
                  ${calculateSubtotal().toFixed(2)}
                </span>
              </div>
              {formData.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">
                    Discount{" "}
                    {formData.discountType === "percentage"
                      ? `(${formData.discount}%)`
                      : ""}
                    :
                  </span>
                  <span className="font-medium text-success">
                    -${calculateDiscount().toFixed(2)}
                  </span>
                </div>
              )}
              {formData.taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">
                    Tax ({formData.taxRate}%):
                  </span>
                  <span className="font-medium">
                    ${calculateTax().toFixed(2)}
                  </span>
                </div>
              )}
              {formData.shipping > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Shipping:</span>
                  <span className="font-medium">
                    ${parseFloat(formData.shipping).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-semibold text-text-primary">Total:</span>
                <span className="text-xl font-bold text-primary">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {formData.notes && (
            <div>
              <h4 className="font-semibold text-text-primary mb-2">Notes</h4>
              <p className="text-sm text-text-secondary bg-gray-50 p-3 rounded-lg">
                {formData.notes}
              </p>
            </div>
          )}

          {formData.terms && (
            <div>
              <h4 className="font-semibold text-text-primary mb-2">
                Terms & Conditions
              </h4>
              <p className="text-sm text-text-secondary bg-gray-50 p-3 rounded-lg">
                {formData.terms}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-border">
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
              Send Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
