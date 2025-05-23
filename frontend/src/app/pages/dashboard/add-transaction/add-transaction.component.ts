import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from '../transaction/transaction.component';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss',
  imports: [ReactiveFormsModule, CommonModule],
})
export class AddTransactionComponent {
  get categories() {
    return TransactionComponent.categories;
  }

  transactionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
  ) {
    this.transactionForm = this.fb.group({});
    this.initializeEmptyForm();
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
    console.log('onSubmit()');
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
