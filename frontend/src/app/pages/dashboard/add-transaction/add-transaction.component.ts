import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-transaction',
  imports: [CommonModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss',
})
export class AddTransactionComponent {
  transactionForm: FormGroup;
  categories = [
    'food',
    'groceries',
    'shopping',
    'transportation',
    'housing',
    'utilites',
    'income',
    'entertainment',
    'health',
    'education',
    'travel',
    'other',
  ];

  newTransaction = {
    title: '',
    amount: 0,
    category: '',
  };

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
  ) {
    this.transactionForm = this.fb.group({
      title: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^-?\d*\.?\d+$/)]],
      category: ['', Validators.required],
      recipient: [''],
      description: [''],
    });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.transactionService.addTransaction(this.transactionForm.value);
      this.transactionForm.reset();
    }
  }
}
