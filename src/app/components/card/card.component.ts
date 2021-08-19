import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  isCardListExpanded = false;

  @Input() title: string;
  @Input() content: CardContent;

  toggleAccordion() {
    this.isCardListExpanded = !this.isCardListExpanded;
  }
}
