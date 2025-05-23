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

  deleteTransaction(id: string | number): void {
    const currentTransactions = this.transactionsSubject.getValue();
    const updatedTransactions = currentTransactions.filter(
      (transaction) => transaction.id !== id,
    );
    this.transactionsSubject.next(updatedTransactions);
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
    console.log('saveTransactions()');
  }

  private generateId(): string {
    return Date.now().toString();
  }
}
