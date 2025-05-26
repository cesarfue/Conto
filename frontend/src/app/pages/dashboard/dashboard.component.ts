import {
  Output,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TransactionService } from '../../core/services/transaction.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

export interface Transaction {
  id: string | number;
  date: Date;
  amount: number;
  category: string;
  recipient: string;
  memo: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class DashboardComponent implements OnInit, OnDestroy {
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() saveTransaction = new EventEmitter<any>();

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

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
  ) {
    this.transactionForm = this.fb.group({});
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
}
