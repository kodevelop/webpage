import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { Blog } from '../models/blog.models';

@Injectable()
export class BlogService {
  constructor(private readonly http: HttpClient) {}

  public getBlogList(): Observable<Blog[]> {
    return this.http.get<Blog[]>('content/blog-list.json').pipe(
      map((result: any) => {
        const blogs =  result.blogs.map((r: any) => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          location: r.location,
        }) as Blog);
        return blogs;
      })
    );
  }
}
