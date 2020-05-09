import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postUpdaded = new Subject<Post[]>();
  private urlApiPost = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) {}

  getPost() {
    this.http
      .get<{ message: string; posts: any }>(this.urlApiPost)
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((transformedPost) => {
        this.posts = transformedPost;
        this.postUpdaded.next([...this.posts]);
      });
  }

  getPostUpdatedListener() {
    return this.postUpdaded.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string; postId: string }>(this.urlApiPost, post)
      .subscribe((responseData) => {
        const id = responseData.postId;
        post.id = id
        this.posts.push(post);
        this.postUpdaded.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http.delete(this.urlApiPost + '/' + postId).subscribe(() => {
      const updatedPosts = this.posts.filter((post) => post.id !== postId);
      this.posts = updatedPosts;
      this.postUpdaded.next([...this.posts]);
    });
  }
}
