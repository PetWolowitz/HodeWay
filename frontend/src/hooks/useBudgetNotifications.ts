import { useEffect } from 'react';
import { useNotificationStore } from '../lib/notifications';
import type { Expense } from '../types';

export function useBudgetNotifications(expenses: Expense[], budget: number) {
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!budget) return;

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentageUsed = (totalExpenses / budget) * 100;

    // Multiple thresholds for notifications
    const thresholds = [
      { percent: 90, type: 'warning', message: 'Critical: You have used 90% of your budget!' },
      { percent: 75, type: 'warning', message: 'Warning: You have used 75% of your budget.' },
      { percent: 50, type: 'info', message: 'You have used 50% of your budget.' },
      { percent: 25, type: 'info', message: 'You have used 25% of your budget.' }
    ] as const;

    for (const threshold of thresholds) {
      if (percentageUsed >= threshold.percent) {
        addNotification({
          type: threshold.type,
          message: threshold.message,
          timeout: 5000,
        });
        break; // Only show the highest threshold notification
      }
    }

    // Daily budget tracking
    const daysInTrip = expenses.reduce((acc, expense) => {
      acc.add(expense.date.split('T')[0]);
      return acc;
    }, new Set<string>()).size;

    if (daysInTrip > 0) {
      const dailyBudget = budget / daysInTrip;
      const averageDailySpend = totalExpenses / daysInTrip;

      if (averageDailySpend > dailyBudget) {
        addNotification({
          type: 'warning',
          message: `Daily spending (€${averageDailySpend.toFixed(2)}) exceeds daily budget (€${dailyBudget.toFixed(2)})`,
          timeout: 5000,
        });
      }
    }
  }, [expenses, budget, addNotification]);
}