import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Currency {
  symbol: string;
  code: string;
  rate?: number; // optional for conversion
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  // Default currency
  private currencySubject = new BehaviorSubject<Currency>({ symbol: '€', code: 'EUR', rate: 1 });
  currency$ = this.currencySubject.asObservable();

  constructor() { }

  // Set a new currency
  setCurrency(currency: Currency) {
    this.currencySubject.next(currency);
  }

  // Get current currency synchronously
  getCurrentCurrency(): Currency {
    return this.currencySubject.value;
  }
}
