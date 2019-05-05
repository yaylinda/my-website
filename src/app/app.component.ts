import { Component } from '@angular/core';
import { HostListener, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild("person", {read: ElementRef}) 
  personRef: ElementRef;
  
  moveInterval: number;

  constructor() {
    this.moveInterval = 10;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let currentX = this.personRef.nativeElement.getBoundingClientRect().x;
    let currentY = this.personRef.nativeElement.getBoundingClientRect().y;
    console.log("********** Current: **********")
    console.log(`\tx: ${currentX}`);
    console.log(`\ty: ${currentY}`);

    let newX, newY;

    switch(event.keyCode) {
      case 37:
        console.log('37 - left');
        newX = currentX - this.moveInterval;
        newY = currentY;
        this.personRef.nativeElement.style.left = `${newX}px`;
        break; 
      case 38:
        console.log('38 - up');
        newX = currentX;
        newY = currentY - this.moveInterval
        this.personRef.nativeElement.style.top = `${newY}px`;
        break;
      case 39:
        console.log('39 - right');
        newX = currentX + this.moveInterval;
        newY = currentY;
        this.personRef.nativeElement.style.left = `${newX}px`;
        break;
      case 40:
        newX = currentX;
        newY = currentY + this.moveInterval;
        console.log('30 - down');
        this.personRef.nativeElement.style.top = `${newY}px`;
        break;
      default:
        console.log('ignoring non-arrow keypresses');
        break;
    }

    console.log("Updated:")
    console.log(`\tx: ${newX}`);
    console.log(`\ty: ${newY}`);
  }
}
