import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class DataTableService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async init(selector: string, options: any = {}): Promise<any> {
    if (!this.isBrowser) {
      return null;
    }

    const $ = (await import('jquery')).default;
    await import('datatables.net');
    await import('datatables.net-bs5');

    const defaultOptions = {
      responsive: true,
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      ...options,
    };

    return ($(selector) as any).DataTable(defaultOptions);
  }

  destroy(tableInstance: any): void {
    if (tableInstance && typeof tableInstance.destroy === 'function') {
      tableInstance.destroy();
    }
  }
}
