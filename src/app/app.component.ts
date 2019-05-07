import { Component, OnInit } from '@angular/core';
import { HostListener, ViewChild, ElementRef } from '@angular/core';
import { MarkerComponent } from './marker/marker.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild("person", {read: ElementRef}) 
  personRef: ElementRef;

  @ViewChild("childhoodMarker", {read: ElementRef}) 
  childhoodMarker: ElementRef;

  @ViewChild("collegeMarker", {read: ElementRef}) 
  collegeMarker: ElementRef;

  @ViewChild("internshipsMarker", {read: ElementRef}) 
  internshipsMarker: ElementRef;

  @ViewChild("capitalOnePart1Marker", {read: ElementRef}) 
  capitalOnePart1Marker: ElementRef;

  @ViewChild("capitalOnePart2Marker", {read: ElementRef}) 
  capitalOnePart2Marker: ElementRef;

  gridSize: number;
  moveInterval: number;
  markersList: ElementRef[];

  constructor() {
    console.log('constructor called...');
    this.gridSize = 16;
    this.moveInterval = this.gridSize / 2;
  }

  ngOnInit() {
    console.log('onInit called...');
    this.markersList = [
      this.childhoodMarker,
      this.collegeMarker, 
      this.internshipsMarker,
      this.capitalOnePart1Marker,
      this.capitalOnePart2Marker
    ];
    this.setMarkerLocations();
  }

  setMarkerLocations() {
    this.personRef.nativeElement.style.left = `${this.gridSize * this.personRef.nativeElement.getAttribute('gridX')}px`;
    this.personRef.nativeElement.style.top = `${this.gridSize * this.personRef.nativeElement.getAttribute('gridY')}px`;

    this.markersList.forEach(m => {
      m.nativeElement.style.left = `${this.gridSize * m.nativeElement.getAttribute('gridX')}px`;
      m.nativeElement.style.top = `${this.gridSize * m.nativeElement.getAttribute('gridY')}px`;
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    const currentX = this.personRef.nativeElement.getBoundingClientRect().x;
    const currentY = this.personRef.nativeElement.getBoundingClientRect().y;

    let newX, newY;

    switch(event.keyCode) {
      case 37:
        newX = currentX - this.moveInterval;
        newY = currentY;
        this.personRef.nativeElement.style.left = `${newX}px`;
        break; 
      case 38:
        newX = currentX;
        newY = currentY - this.moveInterval
        this.personRef.nativeElement.style.top = `${newY}px`;
        break;
      case 39:
        newX = currentX + this.moveInterval;
        newY = currentY;
        this.personRef.nativeElement.style.left = `${newX}px`;
        break;
      case 40:
        newX = currentX;
        newY = currentY + this.moveInterval;
        this.personRef.nativeElement.style.top = `${newY}px`;
        break;
      default:
        console.log('ignoring non-arrow keypresses');
        break;
    }

    this.markersList.forEach(m => {
      if (this.calculateCollision(m)) {
        console.log(`COLLIDE! with: ${m.nativeElement.getAttribute('label')}`);
        m.nativeElement.querySelector('.marker').classList.add('marker-selected');
      } else {
        m.nativeElement.querySelector('.marker').classList.remove('marker-selected');
      }
    });
  }

  calculateCollision(markerRef: ElementRef) {
    const personLeft = this.personRef.nativeElement.getBoundingClientRect().left;
    const personRight = personLeft + this.gridSize
    const personTop = this.personRef.nativeElement.getBoundingClientRect().top;
    const personBottom = personTop + this.gridSize;

    const markerLeft = markerRef.nativeElement.getBoundingClientRect().left;
    const markerRight = markerLeft + this.gridSize;
    const markerTop = markerRef.nativeElement.getBoundingClientRect().top;
    const markerBottom = markerTop + this.gridSize;

    const x_overlap = Math.max(0, Math.min(personRight, markerRight) - Math.max(personLeft, markerLeft));
    const y_overlap = Math.max(0, Math.min(personBottom, markerBottom) - Math.max(personTop, markerTop));
    const overlapArea = x_overlap * y_overlap;

    return overlapArea > 0;
  }
}
