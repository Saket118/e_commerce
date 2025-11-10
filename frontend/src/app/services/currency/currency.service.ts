import { Injectable, signal, Signal } from '@angular/core';
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

  // RxJS BehaviorSubject for subscriptions
  private currencySubject = new BehaviorSubject<Currency>({ symbol: '€', code: 'EUR', rate: 1 });
  currency$ = this.currencySubject.asObservable();

  // Angular 20 Signal for reactive templates
  currencySignal: Signal<Currency> = signal({ symbol: '€', code: 'EUR', rate: 1 });

  constructor() { }

  // Set a new currency (updates both RxJS and Signal)
  setCurrency(currency: Currency) {
    this.currencySubject.next(currency);             // RxJS update
this.currencySignal = signal(currency);
  }

  // Get current currency synchronously (from RxJS)
  getCurrentCurrency(): Currency {
    return this.currencySubject.value;
  }
}
