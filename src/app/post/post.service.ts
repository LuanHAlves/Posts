import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postUpdaded = new Subject<Post[]>();
  private urlApiPost = 'http://localhost:3000/api/posts/';

  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(this.urlApiPost)
      .pipe(
        map((postData) => {
          return postData.posts.map((post: { _id: string; title: string; content: string; imagePath: string }) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
            };
          });
        })
      )
      .subscribe((transformedPost) => {
        this.posts = transformedPost;
        this.postUpdaded.next([...this.posts]);
      });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string; imagePath: string }>(this.urlApiPost + id);
  }

  getPostUpdatedListener() {
    return this.postUpdaded.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(this.urlApiPost, postData)
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath,
        };
        this.posts.push(post);
        this.postUpdaded.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    console.log("Here-updatePost")
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
      };
    }
    this.http
      .put(this.urlApiPost + id, postData)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: '',
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postUpdaded.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http.delete(this.urlApiPost + postId).subscribe(() => {
      const updatedPosts = this.posts.filter((post) => post.id !== postId);
      this.posts = updatedPosts;
      this.postUpdaded.next([...this.posts]);
    });
  }
}
