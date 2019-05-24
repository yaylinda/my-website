import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LifeData } from './util/life-data';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatChipsModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [
    LifeData
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
