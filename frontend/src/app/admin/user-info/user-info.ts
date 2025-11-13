import { Component, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Globledata } from "../../services/globleData/globledata"

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-info.html',
  styleUrls: ['./user-info.css'],
})
export class UserInfo  implements OnInit, AfterViewInit, OnDestroy {

  private table: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private globledata: Globledata,
    private cdr: ChangeDetectorRef
  ) {}

  data: any[] = [];

  ngOnInit() {
    this.globledata.getUsers().subscribe((res:any)=>{
      this.data = res;
      // After data is bound, ensure DataTable initializes with rows
      if (isPlatformBrowser(this.platformId)) {
        // Let Angular render the table first
        this.cdr.detectChanges();
        // Re-init or init the DataTable
        this.initOrRefreshDataTable();
      }
    })
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
      // Destroy existing table instance if already initialized
      if (this.table) {
        this.table.destroy();
        this.table = null;
      }
      this.table = ($ as any).default('#dataTable').DataTable({
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
