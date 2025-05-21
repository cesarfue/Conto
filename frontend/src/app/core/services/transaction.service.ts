import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from '../../pages/dashboard/transaction/transaction.component';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactionsSubject.asObservable();

  constructor() {
    this.loadInitialData();
  }

  addTransaction(transaction: Transaction): void {
    const currentTransactions = this.transactionsSubject.getValue();

    const newTransaction = {
      ...transaction,
      id: this.generateId(),
      date: new Date(),
    };

    this.transactionsSubject.next([newTransaction, ...currentTransactions]);
    this.saveTransactions();
  }

  private loadInitialData(): void {
    const savedTransactions = localStorage.getItem('transactions');
    const initialData = savedTransactions ? JSON.parse(savedTransactions) : [];
    this.transactionsSubject.next(initialData);
  }

  private saveTransactions(): void {
    localStorage.setItem(
      'transactions',
      JSON.stringify(this.transactionsSubject.getValue()),
    );
  }

  private generateId(): string {
    return Date.now().toString();
  }
}
