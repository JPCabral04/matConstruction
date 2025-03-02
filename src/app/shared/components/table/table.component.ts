import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() data: any[] = [];

  @ContentChild('customHeader', { static: true }) customHeader!: TemplateRef<any>;
  @ContentChild('customBody', { static: true }) customBody!: TemplateRef<any>;
}
