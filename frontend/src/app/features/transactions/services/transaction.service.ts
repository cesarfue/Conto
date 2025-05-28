import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from '../models/transactions.model';

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

  deleteMultipleTransactions(ids: (string | number)[]): void {
    const currentTransactions = this.transactionsSubject.getValue();
    const updatedTransactions = currentTransactions.filter(
      (transaction) => !ids.includes(transaction.id),
    );
    this.transactionsSubject.next(updatedTransactions);
    this.saveTransactions();
  }

  updateTransaction(updatedTransaction: Transaction): void {
    const currentTransactions = this.transactionsSubject.getValue();
    const updatedTransactions = currentTransactions.map((transaction) =>
      transaction.id === updatedTransaction.id
        ? updatedTransaction
        : transaction,
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
  }

  getTransaction(id: string | number): Transaction | null {
    const currentTransactions = this.transactionsSubject.getValue();
    return (
      currentTransactions.find((transaction) => transaction.id === id) || null
    );
  }
}
