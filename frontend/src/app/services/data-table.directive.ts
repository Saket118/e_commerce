import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { DataTableService } from './data-table.service';

@Directive({
  selector: '[appDataTable]',
  standalone: true,
})
export class DataTableDirective implements AfterViewInit, OnDestroy {
  @Input('appDataTable') options: any;

  private tableInstance: any;

  constructor(
    private el: ElementRef,
    private dataTableService: DataTableService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    const nativeElement = this.el.nativeElement as HTMLElement;
    if (!nativeElement.id) {
      console.warn('appDataTable directive requires the host element to have an id');
      return;
    }
    const selector = '#' + nativeElement.id;
    this.tableInstance = await this.dataTableService.init(selector, this.options || {});
  }

  ngOnDestroy(): void {
    this.dataTableService.destroy(this.tableInstance);
  }
}
