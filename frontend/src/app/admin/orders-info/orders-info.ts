import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Globledata } from '../../services/globleData/globledata';
import { DataTableService } from '../../services/data-table.service';

@Component({
  selector: 'app-orders-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-info.html',
  styleUrls: ['./orders-info.css'],
})
export class OrdersInfo implements OnInit, OnDestroy {
  data: any[] = [];
  private table: any;

  constructor(
    private globledata: Globledata,
    private dataTableService: DataTableService
  ) {}

  ngOnInit() {
    this.globledata.getOrdersAll().subscribe((res: any) => {
      this.data = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
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

    this.table = await this.dataTableService.init('#ordersTable');
  }

  ngOnDestroy() {
    if (this.table) {
      this.dataTableService.destroy(this.table);
    }
  }
}
