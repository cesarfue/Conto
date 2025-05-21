import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Transaction {
  id: string | number;
  title: string;
  amount: number;
  date: Date;
  category: string;
  recipient?: string;
  description?: string;
}

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  imports: [CommonModule],
})
export class TransactionComponent {
  @Input() transaction!: Transaction;

  getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      food: 'fa-utensils',
      groceries: 'fa-shopping-basket',
      shopping: 'fa-shopping-bag',
      transportation: 'fa-car',
      housing: 'fa-home',
      utilities: 'fa-bolt',
      income: 'fa-wallet',
      entertainment: 'fa-film',
      health: 'fa-heartbeat',
      education: 'fa-graduation-cap',
      travel: 'fa-plane',
      other: 'fa-receipt',
    };

    return iconMap[category.toLowerCase()] || 'fa-receipt';
  }
}
