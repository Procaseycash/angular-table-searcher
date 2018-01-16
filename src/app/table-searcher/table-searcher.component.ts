import {Component, Input, OnInit} from '@angular/core';
@Component({
  selector: 'app-table-searcher',
  templateUrl: './table-searcher.component.html',
  styleUrls: ['./table-searcher.component.css'],
})
export class TableSearcherComponent implements OnInit {
  @Input() childEnpoint: string;
  @Input() enabled: Array<string> = ['SEARCH', 'STATUS', 'CURRENCY', 'DATE'];
  @Input() data: Array<Object> = [];
  @Input() searchKeys: Array<string> = ['name', 'status', 'created_at'];
  @Input() specialBroadcast = 'default';
  @Input() from = 'new_data';

  constructor() {}

  ngOnInit() {
  }

}
