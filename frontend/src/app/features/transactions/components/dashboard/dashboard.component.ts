import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TransactionService } from '../../services/transaction.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Transaction } from '../../models/transactions.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  transactions: Transaction[] = [];
  showAddForm = false;
  selectedTransactions: Set<string | number> = new Set();
  categories = [
    { name: 'income', icon: 'fa-wallet' },
    { name: 'groceries', icon: 'fa-shopping-basket' },
    { name: 'utilities', icon: 'fa-bolt' },
    { name: 'entertainment', icon: 'fa-film' },
    { name: 'food', icon: 'fa-utensils' },
    { name: 'transportation', icon: 'fa-car' },
    { name: 'housing', icon: 'fa-home' },
  ];
  transactionForm: FormGroup;
  editingTransaction: string | number | null = null;
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
  ) {
    this.transactionForm = this.fb.group({});
    this.editForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.subscription = this.transactionService.transactions$.subscribe(
      (transactions: Transaction[]) => {
        this.transactions = transactions;
      },
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAddTransaction(): void {
    this.initializeEmptyForm();
    this.showAddForm = true;
  }

  onSaveTransaction(): void {
    if (this.saveForm()) this.showAddForm = false;
  }

  onSaveAndAddTransaction(): void {
    this.saveForm();
    this.initializeEmptyForm();
    this.showAddForm = true;
  }

  onCancelAdd(): void {
    this.showAddForm = false;
  }

  onSelectionChange(transactionId: string | number, event: any): void {
    if (event.target.checked) {
      this.selectedTransactions.add(transactionId);
    } else {
      this.selectedTransactions.delete(transactionId);
    }
  }

  deleteSelected(): void {
    if (this.selectedTransactions.size === 0) return;
    const idsToDelete = Array.from(this.selectedTransactions);
    this.transactionService.deleteMultipleTransactions(idsToDelete);
    this.selectedTransactions.clear();
    console.log(`Deleted ${idsToDelete.length} transactions`);
  }

  private saveForm(): boolean {
    if (this.transactionForm.valid) {
      const formData = this.transactionForm.value;
      const outflow = parseFloat(formData.outflow) || 0;
      const inflow = parseFloat(formData.inflow) || 0;
      const amount = inflow - outflow;

      const transactionData: Transaction = {
        date: new Date(formData.date),
        category: formData.category,
        memo: formData.memo,
        amount: amount,
        id: Date.now().toString(),
        recipient: '',
      };

      this.transactionService.addTransaction(transactionData);
      this.transactionForm.reset();
      return true;
    } else {
      console.log(
        'Transaction Form invalid: ',
        this.transactionForm.status,
        this.transactionForm.value,
      );
      return false;
    }
  }

  private initializeEmptyForm(): void {
    this.transactionForm = this.fb.group({
      date: [new Date().toISOString().split('T')[0], Validators.required],
      category: ['', Validators.required],
      memo: [''],
      outflow: [''],
      inflow: [''],
    });
  }

  startEdit(transaction: Transaction): void {
    this.editingTransaction = transaction.id;
    this.editForm = this.fb.group({
      date: [transaction.date, Validators.required],
      category: [transaction.category, Validators.required],
      memo: [transaction.memo],
      amount: [Math.abs(transaction.amount)], // Show positive value
    });
  }

  saveEdit(): void {
    if (this.editForm.valid && this.editingTransaction) {
      const formData = this.editForm.value;
      const updatedTransaction: Transaction = {
        id: this.editingTransaction,
        date: new Date(formData.date),
        category: formData.category,
        memo: formData.memo,
        amount: formData.amount,
        recipient: '',
      };
      this.transactionService.updateTransaction(updatedTransaction);
      this.cancelEdit();
    }
  }

  cancelEdit(): void {
    this.editingTransaction = null;
    this.editForm.reset();
  }
}
