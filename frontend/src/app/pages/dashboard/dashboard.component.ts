import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Transaction,
  TransactionComponent,
} from './transaction/transaction.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TransactionService } from '../../core/services/transaction.service';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, TransactionComponent, AddTransactionComponent],
})
export class DashboardComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private transactionService: TransactionService) {}

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
}
