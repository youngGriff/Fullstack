import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-sidenav-item',
  templateUrl: './sidenav-item.component.html',
  styleUrls: ['./sidenav-item.component.scss']
})
export class SidenavItemComponent {
  @Input() link: string;
  @Input() title: string;
  @Input() isLast: boolean;

  constructor() {
  }


}
