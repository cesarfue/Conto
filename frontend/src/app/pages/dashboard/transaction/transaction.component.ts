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

  static categories = [
    { name: 'income', icon: 'fa-wallet' },
    { name: 'groceries', icon: 'fa-shopping-basket' },
    { name: 'utilities', icon: 'fa-bolt' },
    { name: 'entertainment', icon: 'fa-film' },
    { name: 'food', icon: 'fa-utensils' },
    { name: 'transportation', icon: 'fa-car' },
    { name: 'housing', icon: 'fa-home' },
  ];

  getCategoryIcon(category: string): string {
    const found = TransactionComponent.categories.find(
      (cat) => cat.name === category,
    );
    return found?.icon || 'fa-receipt';
  }
}
