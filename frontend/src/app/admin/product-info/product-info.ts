import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Globledata } from '../../services/globleData/globledata';
import { DataTableService } from '../../services/data-table.service';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-info.html',
  styleUrls: ['./product-info.css'],
})
export class ProductInfo implements OnInit, OnDestroy {
  data: any[] = [];
  private table: any;

  constructor(
    private globledata: Globledata,
    private dataTableService: DataTableService
  ) {}

  ngOnInit() {
    this.globledata.getProducts().subscribe((res: any) => {
      this.data = res || [];
      setTimeout(() => {
        this.initOrRefreshDataTable();
      }, 0);
    });
  }

  private async initOrRefreshDataTable() {
    if (this.table) {
      this.dataTableService.destroy(this.table);
      this.table = null;
    }

    this.table = await this.dataTableService.init('#productTable');
  }

  ngOnDestroy() {
    if (this.table) {
      this.dataTableService.destroy(this.table);
    }
  }
}
