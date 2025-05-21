import { Component, OnInit } from '@angular/core';
import {
  Transaction,
  TransactionComponent,
} from './transaction/transaction.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, TransactionComponent],
})
export class DashboardComponent implements OnInit {
  transactions: Transaction[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactions = [
      {
        id: 1,
        title: 'Grocery Shopping',
        amount: -120.5,
        date: new Date(2025, 4, 18),
        category: 'groceries',
        recipient: 'Whole Foods',
        description: 'Weekly grocery shopping',
      },
      {
        id: 2,
        title: 'Salary Deposit',
        amount: 3000,
        date: new Date(2025, 4, 15),
        category: 'income',
        recipient: 'Employer Inc.',
      },
      {
        id: 3,
        title: 'Internet Bill',
        amount: -89.99,
        date: new Date(2025, 4, 10),
        category: 'utilities',
        recipient: 'ISP Provider',
      },
    ];
  }
}
