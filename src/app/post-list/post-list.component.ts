import { Component } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostList {
  posts = [
    { title: 'Title 1', content: 'Post 1' },
    { title: 'Title 2', content: 'Post 2' },
    { title: 'Title 3', content: 'Post 3' },
    { title: 'Title 4', content: 'Post 4' },
    { title: 'Title 5', content: 'Post 5' },
  ];
}
