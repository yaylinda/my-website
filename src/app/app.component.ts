import { Component, OnInit } from '@angular/core';
import { HostListener, ViewChild, ElementRef } from '@angular/core';

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

  @ViewChild("marker", {read: ElementRef}) 
  markerRef: ElementRef;
  
  gridSize: number;
  personGridX: number;
  personGridY: number;
  markerGridX: number;
  markerGridY: number;
  moveInterval: number;
  allowMove: boolean;

  constructor() {
    this.gridSize = 16;

    this.personGridX = 6;
    this.personGridY = 18;

    this.markerGridX = 9;
    this.markerGridY = 13;

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

    this.personRef.nativeElement.style.left = `${leftOffset + this.gridSize * this.personGridX}px`;
    this.personRef.nativeElement.style.top = `${topOffset + this.gridSize * this.personGridY}px`;

    this.markerRef.nativeElement.style.left = `${leftOffset + this.gridSize * this.markerGridX}px`;
    this.markerRef.nativeElement.style.top = `${topOffset + this.gridSize * this.markerGridY}px`;
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

    if (this.calculateCollision()) {
      console.log("COLLIDE!");
      this.markerRef.nativeElement.querySelector('.marker').classList.add('marker-selected');
    } else {
      this.markerRef.nativeElement.querySelector('.marker').classList.remove('marker-selected');
    }
  }

  calculateCollision() {
    const personLeft = this.personRef.nativeElement.getBoundingClientRect().left;
    const personRight = personLeft + this.gridSize
    const personTop = this.personRef.nativeElement.getBoundingClientRect().top;
    const personBottom = personTop + this.gridSize;

    const markerLeft = this.markerRef.nativeElement.getBoundingClientRect().left;
    const markerRight = markerLeft + this.gridSize;
    const markerTop = this.markerRef.nativeElement.getBoundingClientRect().top;
    const markerBottom = markerTop + this.gridSize;

    const x_overlap = Math.max(0, Math.min(personRight, markerRight) - Math.max(personLeft, markerLeft));
    const y_overlap = Math.max(0, Math.min(personBottom, markerBottom) - Math.max(personTop, markerTop));
    const overlapArea = x_overlap * y_overlap;

    return overlapArea > 0;
  }
}
