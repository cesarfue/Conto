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

  transactions: Transaction[] = [];
  showAddForm = false;
  private subscription: Subscription = new Subscription();

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
    this.initializeEmptyForm();
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
    this.showAddForm = true;
  }

  onSaveTransaction(transactionData: any): void {
    this.transactionService.addTransaction(transactionData);
    this.showAddForm = false;
  }

  onCancelAdd(): void {
    this.showAddForm = false;
  }

  private initializeEmptyForm(): void {
    this.transactionForm = this.fb.group({
      date: [new Date().toISOString().split('T')[0], Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^-?\d*\.?\d+$/)]],
      category: ['', Validators.required],
      recipient: [''],
      memo: [''],
    });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.transactionService.addTransaction(this.transactionForm.value);
      this.transactionForm.reset();
      this.initializeEmptyForm();
    } else {
      console.log(
        'Transaction Form invalid: ',
        this.transactionForm.status,
        this.transactionForm.value,
      );
    }
  }
}
