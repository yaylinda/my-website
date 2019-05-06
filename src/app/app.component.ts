import { Component, OnInit } from '@angular/core';
import { HostListener, ViewChild, ElementRef } from '@angular/core';
import { MarkerComponent } from './marker/marker.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild("background", {read: ElementRef}) 
  backgroundRef: ElementRef;

  @ViewChild("person", {read: ElementRef}) 
  personRef: ElementRef;

  // @ViewChild("educationMarker") 
  // set educationMarker(m: MarkerComponent) {
  //   this.educationMarkerComp = m;
  // }

  @ViewChild("educationMarker", {read: ElementRef}) 
  educationMarkerRef: ElementRef;

  // @ViewChild("firstInternshipMarker") 
  // firstInternshipMarkerRef: ElementRef;

  // @ViewChild("secondInternshipMarker") 
  // secondInternshipMarkerRef: ElementRef;

  // @ViewChild("thirdInternshipMarker") 
  // thirdInternshipMarkerRef: ElementRef;

  // @ViewChild("capitalOneTDPMarker") 
  // capitalOneTDPMarkerRef: ElementRef;

  // @ViewChild("capitalOneMNavMarker") 
  // capitalOneMNavMarkerRef: ElementRef;
  
  gridSize: number;
  moveInterval: number;
  allowMove: boolean;

  constructor() {
    this.gridSize = 16;

    this.moveInterval = this.gridSize / 2;
    this.allowMove = true;
  }

  ngOnInit() {
    console.log('onInit called...');
    this.setMarkerLocations();
  }

  setMarkerLocations() {
    const leftOffset = this.backgroundRef.nativeElement.querySelector('img').getBoundingClientRect().x;
    console.log(`leftOffset: ${leftOffset}`);

    const topOffset = this.backgroundRef.nativeElement.querySelector('img').getBoundingClientRect().y;
    console.log(`topOffset: ${topOffset}`);

    this.personRef.nativeElement.style.left = `${leftOffset + this.gridSize * this.personRef.nativeElement.getAttribute('gridX')}px`;
    this.personRef.nativeElement.style.top = `${topOffset + this.gridSize * this.personRef.nativeElement.getAttribute('gridY')}px`;

    this.educationMarkerRef.nativeElement.style.left = `${leftOffset + this.gridSize * this.educationMarkerRef.nativeElement.getAttribute('gridX')}px`;
    this.educationMarkerRef.nativeElement.style.top = `${topOffset + this.gridSize * this.educationMarkerRef.nativeElement.getAttribute('gridY')}px`;
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

    if (this.calculateCollision(this.educationMarkerRef)) {
      console.log("COLLIDE!");
      this.educationMarkerRef.nativeElement.querySelector('.marker').classList.add('marker-selected');
    } else {
      this.educationMarkerRef.nativeElement.querySelector('.marker').classList.remove('marker-selected');
    }
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
