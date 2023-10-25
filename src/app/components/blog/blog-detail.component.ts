import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-blog-detail',
    templateUrl: 'blog-detail.component.html',
    styleUrls: ['./blog-detail.component.css']
})

export class BlogDetailComponent implements OnInit {
    @Input() blogUrl: string = '';

    constructor() { }

    ngOnInit() { }

    onError($event: Error | string) {
        console.error($event);
      }
      onLoad($event: Event | string) {
        console.log($event);
      }
}