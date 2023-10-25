import { Component, ViewEncapsulation } from '@angular/core';
import { BlogService } from './blog.service';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-blog-overview',
  templateUrl: './blog-overview.component.html'
})
export class BlogOverviewComponent {
  
  private refresh$ = new BehaviorSubject(null);
  readonly dataSource: Observable<any>;
  
  constructor(private readonly blogService: BlogService) {
    this.dataSource = this.refresh$.pipe(
      switchMap(() => this.blogService.getBlogList()),
      map((m) => m)
    );
  }

  private refresh() {
    this.refresh$.next(null);
  }

  onError($event: Error | string) {
    console.error($event);
  }
  onLoad($event: Event | string) {
    console.log($event);
  }
}
