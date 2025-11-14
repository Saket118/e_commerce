import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Globledata } from '../../services/globleData/globledata';
import { DataTableService } from '../../services/data-table.service';

@Component({
  selector: 'app-wishlist-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist-info.html',
  styleUrls: ['./wishlist-info.css'],
})
export class WishlistInfo implements OnInit, OnDestroy {
  data: any[] = [];
  private table: any;

  constructor(
    private globledata: Globledata,
    private dataTableService: DataTableService
  ) {}

  ngOnInit() {
    this.globledata.getWishlistAll().subscribe((res: any) => {
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

    this.table = await this.dataTableService.init('#wishlistTable');
  }

  ngOnDestroy() {
    if (this.table) {
      this.dataTableService.destroy(this.table);
    }
  }
}
