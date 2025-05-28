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
import { Transaction, CATEGORIES } from '../../models/transactions.model';

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
  transactionForm: FormGroup;
  editingTransaction: Transaction | null = null;
  editForm: FormGroup;
  categories = CATEGORIES;

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

  startEdit(transaction: Transaction, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.editingTransaction = transaction;
    this.editForm = this.fb.group({
      date: [
        new Date(transaction.date).toISOString().split('T')[0],
        Validators.required,
      ],
      category: [transaction.category, Validators.required],
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
    if (this.editingTransaction) {
      const target = event.target as HTMLElement;
      const editForm = target.closest('.edit-form-grid');

      if (!editForm) {
        this.saveEdit();
      }
    }
  }
}
