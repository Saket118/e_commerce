import { TestBed } from '@angular/core/testing';
import { CurrencyService, Currency } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default currency', () => {
    const defaultCurrency: Currency = { symbol: '€', code: 'EUR', rate: 1 };

    // Check BehaviorSubject default value
    expect(service.getCurrentCurrency()).toEqual(defaultCurrency);

    // Check Signal default value
    expect(service.currencySignal()).toEqual(defaultCurrency);
  });

  it('should update currency correctly', () => {
    const newCurrency: Currency = { symbol: '$', code: 'USD', rate: 1.1 };

    service.setCurrency(newCurrency);

    // Verify BehaviorSubject updated
    expect(service.getCurrentCurrency()).toEqual(newCurrency);

    // Verify Signal updated
    expect(service.currencySignal()).toEqual(newCurrency);
  });

  it('should notify subscribers via currency$', (done) => {
    const newCurrency: Currency = { symbol: '£', code: 'GBP', rate: 0.9 };

    service.currency$.subscribe(currency => {
      expect(currency).toEqual(newCurrency);
      done();
    });

    service.setCurrency(newCurrency);
  });
});
