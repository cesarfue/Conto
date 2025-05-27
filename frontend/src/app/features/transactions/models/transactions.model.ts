export interface Transaction {
  id: string | number;
  date: Date;
  amount: number;
  category: string;
  recipient: string;
  memo: string;
}
