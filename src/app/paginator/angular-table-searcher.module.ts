import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EventsService} from './event.service';
import {TableSearcherComponent} from './table-searcher.component';
import {TableSearcherService} from './table-searcher.service';
import {HttpModule} from '@angular/http';

@NgModule({
  imports: [
    HttpModule,
    CommonModule
  ],
  declarations: [TableSearcherComponent],
  exports: [TableSearcherComponent]
})
export class AngularTableSearcherModule {
  static forRoot() {
    return {
      ngModule: AngularTableSearcherModule,
      providers: [TableSearcherService, EventsService]
    };
  }
}
