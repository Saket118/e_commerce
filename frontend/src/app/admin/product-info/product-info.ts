import { Component, Inject, OnDestroy, OnInit, AfterViewInit, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Globledata } from '../../services/globleData/globledata';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-info.html',
  styleUrls: ['./product-info.css'],
})
export class ProductInfo implements OnInit, AfterViewInit, OnDestroy {
  data: any[] = [];
  private table: any;

  constructor(
    private globledata: Globledata,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.globledata.getProducts().subscribe((res: any) => {
      this.data = res || [];
      if (isPlatformBrowser(this.platformId)) {
        this.cdr.detectChanges();
        this.initOrRefreshDataTable();
      }
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initOrRefreshDataTable();
    }
  }

  private async initOrRefreshDataTable() {
    const $ = await import('jquery');
    await import('datatables.net');
    await import('datatables.net-bs5');

    setTimeout(() => {
      if (this.table) {
        this.table.destroy();
        this.table = null;
      }
      this.table = ($ as any).default('#productTable').DataTable({
        responsive: true,
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50]
      });
    }, 0);
  }

  ngOnDestroy() {
    if (this.table) {
      this.table.destroy();
    }
  }
}
