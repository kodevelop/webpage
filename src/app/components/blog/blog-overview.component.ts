import { Component } from '@angular/core';
import { BlogService } from './services/blog.service';
import { BehaviorSubject, Observable, map, startWith, switchMap, take, tap } from 'rxjs';
import { Blog } from './models/blog.models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blog-overview',
  templateUrl: './blog-overview.component.html'
})
export class BlogOverviewComponent {  
  private refresh$ = new BehaviorSubject<string>((''));
  readonly dataSource: Observable<Blog[]>;
  
  constructor(private readonly blogService: BlogService, private readonly router: Router, private readonly route: ActivatedRoute,) {
    this.dataSource = this.refresh$.pipe(
      startWith(''), // Provide your initial filter value here
      switchMap((filterValue: string) =>
        this.blogService.getBlogList().pipe(
          map((blogs) => {
            blogs = blogs.filter(x => x.summary.toLowerCase().includes(filterValue, 0));
            return blogs;
          })
        )
      ),
      take(1),
      tap(x => console.log('+++', x)),
      tap(x => this.router.navigate([x[0].slug], {relativeTo: this.route}))
    );
  }

  onFilterChange(filter: string) {
    const f = filter.toLowerCase();
    this.refresh$.next(f);
  }

  onBlogChanged(slug: string) {
    console.log(slug);
  }

  private refresh() {
    this.refresh$.next('');
  }

  private get currentBlogId(): number {
    return 0;
  }
}
