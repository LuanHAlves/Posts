import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { postMode } from './postModeEnum';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  errorMsg: string = 'Campo Obrigatório';
  isLoading = false;
  private mode;
  private postId: string;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = postMode.edit;
        // funcao de edicao sera implementada futuramente.
      } else {
        this.mode = postMode.create;
      }
    });
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return this.errorMsg;
    }
    this.postService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
}
