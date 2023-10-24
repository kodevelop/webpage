import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class BlogComponent {
  onError($event: Error | string) {
    console.error($event);
  }
  onLoad($event: Event | string) {
    console.log($event);
  }
}
