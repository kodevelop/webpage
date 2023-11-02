import { Component } from '@angular/core';
import { BlogService } from './blog.service';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { Blog } from './models/blog.models';

@Component({
  selector: 'app-blog-overview',
  templateUrl: './blog-overview.component.html'
})
export class BlogOverviewComponent {  
  private refresh$ = new BehaviorSubject<string>('');
  readonly dataSource: Observable<Blog[]>;
  
  constructor(private readonly blogService: BlogService) {
    this.dataSource = this.refresh$.pipe(
      switchMap((filterValue: string) =>
        this.blogService.getBlogList().pipe(
          map((blogs) => {
            blogs = blogs.filter(x => x.slug.toLowerCase().includes(filterValue, 0));
            return blogs;
          })
        )
      )
    );
  }

  onFilterChange(filter: string) {
    const f = filter.toLowerCase();
    this.refresh$.next(f);
  }

  private refresh() {
    this.refresh$.next('');
  }
}
