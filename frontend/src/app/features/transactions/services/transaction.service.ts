import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from '../models/transactions.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactionsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTransactionsFromBackend();
  }

  private loadTransactionsFromBackend(): void {
    const headers = this.getAuthHeaders();

    this.http
      .get<Transaction[]>('http://localhost:8080/api/transactions', { headers })
      .subscribe({
        next: (transactions) => {
          const processedTransactions = transactions.map((t) => ({
            ...t,
            date: new Date(t.date),
          }));
          console.log(processedTransactions);
          this.transactionsSubject.next(processedTransactions);
          this.saveToLocalStorage();
        },
        error: (error) => {
          console.error('Failed to load transactions from backend:', error);
          //this.loadFromLocalStorage();
        },
      });
  }

  addTransaction(transaction: Transaction): void {
    const headers = this.getAuthHeaders();

    const transactionData = {
      date: transaction.date.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
      amount: transaction.amount,
      category: transaction.category,
      recipient: transaction.recipient,
      memo: transaction.memo,
    };

    this.http
      .post<Transaction>(
        'http://localhost:8080/api/transactions',
        transactionData,
        { headers },
      )
      .subscribe({
        next: (savedTransaction) => {
          // Update local state with the saved transaction (which has backend ID)
          const currentTransactions = this.transactionsSubject.getValue();
          this.transactionsSubject.next([
            savedTransaction,
            ...currentTransactions,
          ]);
          this.saveToLocalStorage();
        },
        error: (error) => {
          console.error('Failed to save transaction to backend:', error);
          // Optionally show user notification about the error
        },
      });
  }

  deleteTransaction(id: string | number): void {
    const headers = this.getAuthHeaders();

    this.http.delete(`/api/transactions/${id}`, { headers }).subscribe({
      next: () => {
        const currentTransactions = this.transactionsSubject.getValue();
        const updatedTransactions = currentTransactions.filter(
          (transaction) => transaction.id !== id,
        );
        this.transactionsSubject.next(updatedTransactions);
        this.saveToLocalStorage();
      },
      error: (error) => {
        console.error('Failed to delete transaction from backend:', error);
      },
    });
  }

  deleteMultipleTransactions(ids: (string | number)[]): void {
    const headers = this.getAuthHeaders();

    this.http
      .delete('/api/transactions/batch', {
        headers,
        body: { ids: ids },
      })
      .subscribe({
        next: () => {
          // Remove from local state after successful backend deletion
          const currentTransactions = this.transactionsSubject.getValue();
          const updatedTransactions = currentTransactions.filter(
            (transaction) => !ids.includes(transaction.id),
          );
          this.transactionsSubject.next(updatedTransactions);
          this.saveToLocalStorage();
        },
        error: (error) => {
          console.error('Failed to delete transactions from backend:', error);
        },
      });
  }

  updateTransaction(updatedTransaction: Transaction): void {
    const headers = this.getAuthHeaders();

    const transactionData = {
      date: updatedTransaction.date.toISOString().split('T')[0],
      amount: updatedTransaction.amount,
      category: updatedTransaction.category,
      recipient: updatedTransaction.recipient,
      memo: updatedTransaction.memo,
    };

    this.http
      .put<Transaction>(
        `/api/transactions/${updatedTransaction.id}`,
        transactionData,
        { headers },
      )
      .subscribe({
        next: (savedTransaction) => {
          // Update local state with backend response
          const currentTransactions = this.transactionsSubject.getValue();
          const updatedTransactions = currentTransactions.map((transaction) =>
            transaction.id === savedTransaction.id
              ? { ...savedTransaction, date: new Date(savedTransaction.date) }
              : transaction,
          );
          this.transactionsSubject.next(updatedTransactions);
          this.saveToLocalStorage();
        },
        error: (error) => {
          console.error('Failed to update transaction in backend:', error);
        },
      });
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(
      'transactions',
      JSON.stringify(this.transactionsSubject.getValue()),
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage: ', token);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getTransaction(id: string | number): Transaction | null {
    const currentTransactions = this.transactionsSubject.getValue();
    return (
      currentTransactions.find((transaction) => transaction.id === id) || null
    );
  }
}
