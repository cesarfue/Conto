import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from '../transaction/transaction.component';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss',
  imports: [FormsModule, CommonModule],
})
export class AddTransactionComponent {
  get categories() {
    return TransactionComponent.categories;
  }

  transactionForm: FormGroup;

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
