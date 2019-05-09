import { Component, OnInit } from '@angular/core';
import { HostListener, ViewChild, ElementRef } from '@angular/core';
import { LifeData } from './util/life-data';
import { exists } from 'fs';

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

  @ViewChild("infoCard", {read: ElementRef})
  infoCard: ElementRef;

  gridSize: number;
  moveInterval: number;
  markersList: ElementRef[];
  isCollide: boolean;
  lifeData: LifeData;
  collidedLabel: string;
  cardInfo: {};

  constructor(lifeData: LifeData) {
    console.log('constructor called...');
    this.gridSize = 16;
    this.moveInterval = this.gridSize / 2;
    this.isCollide = false;
    this.lifeData = lifeData;
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
    this.infoCard.nativeElement.querySelector('mat-card-title').innerText = 'Exploring...';
    this.infoCard.nativeElement.querySelector('mat-card-subtitle').innerText = '';
    this.infoCard.nativeElement.querySelector('mat-card-content').innerText = '';
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

    console.log(`pressed: ${event.keyCode}`);

    const currentX = parseInt(this.personRef.nativeElement.style.left.replace('px', ''));
    const currentY = parseInt(this.personRef.nativeElement.style.top.replace('px', ''));

    console.log(`currentX: ${currentX}, currentY: ${currentY}`);
    let newX, newY;

    switch(event.keyCode) {
      case 37:
      case 65:
        newX = currentX - this.moveInterval;
        newY = currentY;
        this.personRef.nativeElement.style.left = `${newX}px`;
        break;
      case 38:
      case 87:
        newX = currentX;
        newY = currentY - this.moveInterval
        this.personRef.nativeElement.style.top = `${newY}px`;
        break;
      case 39:
      case 68:
        newX = currentX + this.moveInterval;
        newY = currentY;
        this.personRef.nativeElement.style.left = `${newX}px`;
        break;
      case 40:
      case 83:
        newX = currentX;
        newY = currentY + this.moveInterval;
        this.personRef.nativeElement.style.top = `${newY}px`;
        break;
      case 13:
      case 32:
        console.log('TODO - show info');
        break;
      default:
        console.log('ignoring unknown keypress...');
        break;
    }

    console.log(`newX: ${newX}, newY: ${newY}`);

    for (let m of this.markersList) {
      if (this.calculateCollision(m)) {
        m.nativeElement.classList.add('marker-selected');
        this.isCollide = true;
        this.collidedLabel = m.nativeElement.getAttribute('label');
        console.log(`COLLIDE! with: ${this.collidedLabel}`);
        this.cardInfo = this.lifeData.data[this.collidedLabel];
        console.log(this.cardInfo);
        this.infoCard.nativeElement.querySelector('mat-card-title').innerText = this.cardInfo['title'];
        this.infoCard.nativeElement.querySelector('mat-card-subtitle').innerText = this.cardInfo['subtitle'];
        this.infoCard.nativeElement.querySelector('mat-card-content').innerText = this.cardInfo['content'];
        this.infoCard.nativeElement.querySelector('.circle-icon').classList.remove('circle-icon-gray');
        break;
      } else {
        m.nativeElement.classList.remove('marker-selected');
        this.isCollide = false;
        this.infoCard.nativeElement.querySelector('mat-card-title').innerText = 'Exploring...';
        this.infoCard.nativeElement.querySelector('mat-card-subtitle').innerText = '';
        this.infoCard.nativeElement.querySelector('mat-card-content').innerText = '';
        this.infoCard.nativeElement.querySelector('.circle-icon').classList.add('circle-icon-gray');
      }
    }
    this.markersList.forEach(m => {
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
