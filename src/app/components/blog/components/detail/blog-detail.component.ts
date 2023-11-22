import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog-detail',
  templateUrl: 'blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css'],
})
export class BlogDetailComponent implements OnInit, OnDestroy {
  public blogUrl: string = '';
  private slug: string = '';
  private sub: any;

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.slug = params['slug'];
      this.blogUrl = `assets/content/blog-posts/${this.slug}.md`;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onError($event: Error | string) {
    console.error($event);
  }
  onLoad($event: Event | string) {
    console.log($event);
  }
}
