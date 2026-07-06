"use client";

import Link from "next/link";

interface Customer {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

interface RecentCustomersProps {
  customers: Customer[];
}

export default function RecentCustomers({ customers }: RecentCustomersProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">Recent Customers</h2>
        <Link
          href="/dashboard/users"
          className="text-sm text-cyan-600 hover:text-cyan-700"
        >
          View All
        </Link>
      </div>

      {customers.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No customers yet</p>
      ) : (
        <div className="space-y-3">
          {customers.map((customer) => (
            <div
              key={customer._id}
              className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
            >
              {/* customer avatar - first letter of name */}
              <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-semibold text-sm shrink-0">
                {customer.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {customer.fullName}
                </p>
                <p className="text-xs text-gray-400 truncate">{customer.email}</p>
              </div>
              {/* joined date */}
              <p className="text-xs text-gray-400 flex-0">
                {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
