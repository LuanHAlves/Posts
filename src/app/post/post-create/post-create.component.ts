import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';

import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostModeEnum } from './postModeEnum';
import { Post } from '../post.model';

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
  post: Post;
  mode: string = PostModeEnum.create;
  form: FormGroup;
  private postId: string;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {validators: []})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = PostModeEnum.edit;
        this.postId = paramMap.get('postId');
        this.post = this.postService.getPost(this.postId);
        this.form.setValue({
          title: this.post.title,
          content: this.post.content,
        });
      } else {
        this.mode = PostModeEnum.create;
        this.postId = null;
      }
    });
  }
  onImagePick(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
  }

  onSavePost() {
    if (this.form.invalid) {
      return this.errorMsg;
    }
    this.isLoading = true;
    if (this.mode === PostModeEnum.create) {
      this.postService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }
    this.form.reset();
  }
}
