import React from 'react';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Expense } from '@/types';
import { ExpenseChart } from './ExpenseChart';

interface BudgetDashboardProps {
  expenses: Expense[];
  budget?: number;
}

export function BudgetDashboard({ expenses, budget = 0 }: BudgetDashboardProps) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = budget - totalExpenses;
  const percentageUsed = budget > 0 ? (totalExpenses / budget) * 100 : 0;

  // Get expenses for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentExpenses = expenses.filter(
    expense => new Date(expense.date) >= thirtyDaysAgo
  );

  const recentTotal = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">€{budget.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
          {budget > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Progress</span>
                <span>{percentageUsed.toFixed(1)}%</span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(percentageUsed, 100)}%`,
                    backgroundColor: percentageUsed > 90 ? 'rgb(239 68 68)' : undefined
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">€{totalExpenses.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <ArrowUpRight className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Last 30 days: €{recentTotal.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Remaining Budget</p>
              <p className="text-2xl font-bold text-gray-900">€{remaining.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ArrowDownRight className="h-6 w-6 text-green-600" />
            </div>
          </div>
          {budget > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              {remaining > 0 ? 'Still available' : 'Over budget'}
            </p>
          )}
        </div>
      </div>

      {/* Expense Charts */}
      {expenses.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <ExpenseChart expenses={expenses} />
        </div>
      )}
    </div>
  );
}