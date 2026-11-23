'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  Calendar,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export default function AdminTransactionsPage() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function loadTransactions() {
      setLoading(true);
      try {
        const [txnRes, revRes] = await Promise.all([
          api.get('/admin/payments/transactions', { token }),
          api.get('/admin/payments/revenue', { token }),
        ]);

        if (txnRes?.success && Array.isArray(txnRes?.transactions)) {
          setTransactions(txnRes.transactions);
        } else {
          setTransactions([]);
        }

        if (revRes?.success && revRes?.data) {
          setRevenue(revRes.data.totalRevenue || 0);
        }
      } catch (err) {
        console.error('Failed to load transaction data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [token]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Stripe Transactions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete log of verified Stripe subscription payments, Pro tier upgrades, and platform revenue.
          </p>
        </div>

        {/* Revenue Badge */}
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider block">
              Total Stripe Revenue
            </span>
            <span className="text-xl font-black text-purple-900">
              ${loading ? '...' : Number(revenue).toLocaleString()} USD
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading transaction records...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-2">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Transactions Yet</h3>
          <p className="text-xs text-slate-500">
            When users subscribe to Pro tiers through Stripe, payment records will be recorded here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Subscriber</th>
                  <th className="py-4 px-6">Role & Plan</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Payment Status</th>
                  <th className="py-4 px-6">Stripe Session ID</th>
                  <th className="py-4 px-6 text-right">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((txn) => (
                  <tr key={txn._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{txn.userName || 'Subscriber'}</div>
                      <div className="text-[10px] text-slate-500">{txn.userEmail}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="capitalize font-semibold text-slate-800">{txn.userRole}</div>
                      <div className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded mt-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                        <span>{txn.planName?.toUpperCase() || 'PRO'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                      ${txn.amount} <span className="text-[10px] font-normal text-slate-500">USD</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>{txn.paymentStatus}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-[10px] text-slate-500 max-w-[180px] truncate">
                      {txn.stripeSessionId}
                    </td>
                    <td className="py-4 px-6 text-right text-slate-600">
                      {txn.paidAt ? new Date(txn.paidAt).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
