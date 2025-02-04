import React, { useState, useMemo } from 'react';
import { DollarSign, Calendar, Tag, Download, Search, ArrowUpDown } from 'lucide-react';
import type { Expense, ExpenseCategory } from '@/types';
import { format } from 'date-fns';
import { Button } from '../../common/button';

interface ExpensesListProps {
  expenses: Expense[];
  onEdit?: (id: string) => void;
}

type SortField = 'date' | 'amount' | 'category';
type SortDirection = 'asc' | 'desc';

export function ExpensesList({ expenses, onEdit }: ExpensesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filter and sort expenses
  const filteredAndSortedExpenses = useMemo(() => {
    return expenses
      .filter(expense => {
        const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const multiplier = sortDirection === 'asc' ? 1 : -1;
        switch (sortField) {
          case 'date':
            return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
          case 'amount':
            return multiplier * (a.amount - b.amount);
          case 'category':
            return multiplier * a.category.localeCompare(b.category);
          default:
            return 0;
        }
      });
  }, [expenses, searchTerm, categoryFilter, sortField, sortDirection]);

  // Group expenses by category
  const expensesByCategory = useMemo(() => {
    return filteredAndSortedExpenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(expense);
      return acc;
    }, {} as Record<string, Expense[]>);
  }, [filteredAndSortedExpenses]);

  // Calculate totals
  const totalByCategory = useMemo(() => {
    return Object.entries(expensesByCategory).reduce((acc, [category, expenses]) => {
      acc[category] = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      return acc;
    }, {} as Record<string, number>);
  }, [expensesByCategory]);

  const grandTotal = useMemo(() => {
    return Object.values(totalByCategory).reduce((sum, total) => sum + total, 0);
  }, [totalByCategory]);

  // Export expenses to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Category', 'Description', 'Amount', 'Currency'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedExpenses.map(expense => [
        format(new Date(expense.date), 'yyyy-MM-dd'),
        expense.category,
        `"${expense.description}"`,
        expense.amount,
        expense.currency
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `expenses_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 min-w-[200px] max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as ExpenseCategory | 'all')}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="all">All Categories</option>
            <option value="accommodation">Accommodation</option>
            <option value="transport">Transport</option>
            <option value="food">Food</option>
            <option value="activities">Activities</option>
            <option value="other">Other</option>
          </select>

          <Button
            onClick={exportToCSV}
          
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-primary/5 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-2xl font-bold text-primary">
              €{grandTotal.toFixed(2)}
            </p>
          </div>
          {Object.entries(totalByCategory).map(([category, total]) => (
            <div key={category} className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 capitalize">{category}</p>
              <p className="text-xl font-semibold text-gray-900">
                €{total.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {Object.entries(expensesByCategory).map(([category, categoryExpenses]) => (
            <div key={category} className="p-6">
              <h4 className="text-lg font-medium text-gray-900 capitalize mb-4">
                {category}
              </h4>
              <div className="space-y-4">
                {categoryExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer"
                    onClick={() => onEdit?.(expense.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <DollarSign className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {expense.description}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {expense.amount.toFixed(2)} {expense.currency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}