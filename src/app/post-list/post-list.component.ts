import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post/post.model';
import { PostService } from '../post/post.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading: boolean = false;
  totalPosts = 0;
  postsPerPage = 4;
  pageSizeOptions = [1, 2, 4, 10];
  currentPage = 1;
  userIsAutheticated = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public postService: PostService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, 1);
    this.postsSub = this.postService.getPostUpdatedListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount
        this.posts = postData.posts;
      });
      this.userIsAutheticated = this.authService.getIsAuthenticated();
      this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAutheticated => {
      this.userIsAutheticated = isAutheticated;
    })
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(post: Post) {
    this.isLoading = true;
    this.postService.deletePost(post.id).subscribe(() => {
      if (this.posts.length === 1) {
        this.currentPage = 1;
      }
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    })
  }
}
