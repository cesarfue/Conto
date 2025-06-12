import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TransactionService } from '../../services/transaction.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  Transaction,
  CATEGORIES,
  ACTIONS,
} from '../../models/transactions.model';

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
  transactionForm: FormGroup;
  editingTransaction: Transaction | null = null;
  editForm: FormGroup;
  categories = CATEGORIES;
  actions = ACTIONS;
  activeMenuTransactionId: string | number | null = null;

  menuPosition = { x: 0, y: 0 };

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

  // Add transaction methods

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

  // Transaction Menu Methods

  toggleTransactionMenu(
    event: MouseEvent,
    transactionId: string | number,
    buttonElement: HTMLElement,
  ): void {
    event.stopPropagation();

    if (this.activeMenuTransactionId === transactionId) {
      this.activeMenuTransactionId = null;
    } else {
      this.activeMenuTransactionId = transactionId;

      const rect = buttonElement.getBoundingClientRect();
      this.menuPosition = {
        x: rect.right - 140,
        y: rect.bottom + 4,
      };
    }
  }

  getTransactionById(id: string | number): Transaction {
    return this.transactions.find((t) => t.id === id)!;
  }

  deleteTransaction(transactionId: string | number): void {
    this.transactionService.deleteTransaction(transactionId);
    this.activeMenuTransactionId = null;
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
        action: formData.action,
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
      action: [''],
      memo: [''],
      outflow: [''],
      inflow: [''],
    });
  }

  startEdit(transaction: Transaction, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.activeMenuTransactionId = null;
    this.editingTransaction = transaction;
    this.editForm = this.fb.group({
      date: [
        new Date(transaction.date).toISOString().split('T')[0],
        Validators.required,
      ],
      category: [transaction.category, Validators.required],
      action: [transaction.action],
      memo: [transaction.memo],
      outflow: [transaction.amount < 0 ? Math.abs(transaction.amount) : ''],
      inflow: [transaction.amount > 0 ? transaction.amount : ''],
    });

    setTimeout(() => {
      const dateInput = document.querySelector(`input[formControlName="date"]`);
      if (dateInput) {
        (dateInput as HTMLElement).focus();
      }
    }, 50);
  }

  saveEdit(): void {
    if (this.editForm.valid && this.editingTransaction) {
      const formData = this.editForm.value;
      const outflow = parseFloat(formData.outflow) || 0;
      const inflow = parseFloat(formData.inflow) || 0;
      const amount = inflow - outflow;

      const updatedTransaction: Transaction = {
        ...this.editingTransaction,
        date: new Date(formData.date),
        category: formData.category,
        action: formData.action,
        memo: formData.memo,
        amount: amount,
      };
      this.transactionService.updateTransaction(updatedTransaction);
    }

    this.editingTransaction = null;
    this.editForm.reset();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.editingTransaction) {
      const editForm = target.closest('.edit-form-grid');

      if (!editForm) {
        this.saveEdit();
      }
    }
    if (
      !target.closest('.dots-cell') &&
      !target.closest('.transaction-dropdown')
    ) {
      this.activeMenuTransactionId = null;
    }
  }
}
