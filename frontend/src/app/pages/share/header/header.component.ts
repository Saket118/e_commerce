import { Component, OnInit } from '@angular/core';
import { CurrencyService,Currency } from '../../../GlobleService/currency.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  categories = [
    { id: 1, name: 'Desktops' },
    { id: 2, name: 'Laptops & Notebooks' },
    { id: 3, name: 'Components' },
    { id: 4, name: 'Tablets' },
    { id: 5, name: 'Software' },
    { id: 6, name: 'Phones & PDAs' },
    { id: 7, name: 'Cameras' },
    { id: 8, name: 'MP3 Players' }
  ];

  selectedCurrency: Currency = { symbol: '€', code: 'EUR', rate: 1 };
  currencies: Currency[] = [
    { symbol: '€', code: 'EUR', rate: 1 },
    { symbol: '$', code: 'USD', rate: 1.1 },
    { symbol: '₹', code: 'INR', rate: 90 }
  ];

  constructor(private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.currencyService.currency$.subscribe(cur => this.selectedCurrency = cur);
  }

  changeCurrency(currency: Currency) {
    this.currencyService.setCurrency(currency);
  }

}
