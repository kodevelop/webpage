import { Component, Input, Output, EventEmitter, Pipe, ViewChild, ElementRef } from '@angular/core';
import { Blog } from '../../models/blog.models';
import { Observable, debounceTime, take, tap } from 'rxjs';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css'],
})
export class BlogListComponent {
  @Input() blogPosts: Observable<Blog[]> = new Observable<Blog[]>();
  @Output() filter = new EventEmitter<string>();
  @Output() blogChanged = new EventEmitter<string>();

  @ViewChild('filterInput') filterInput!: ElementRef;


  constructor() {
    this.filter.pipe(debounceTime(500));
  }

  ngAfterViewInit() {
    const inputElement = this.filterInput.nativeElement;
    inputElement.addEventListener('input', (event: any) => {
      const filterValue = event.target.value;
      this.filter.emit(filterValue);
    });
  }

  trackClick(slug: string) {
    console.log(slug);  
    this.filter.emit(slug);
  }
}
