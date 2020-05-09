import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  title = '  Post ';
  createPost = 'Create a post';
  posts = 'Show Posts';
}
