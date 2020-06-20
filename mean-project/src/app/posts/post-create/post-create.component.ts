import { Component, EventEmitter, Output} from '@angular/core';

import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  @Output() postCreated = new EventEmitter<Post>();

  // function  for adding a post to the site
  onAddPost(form: NgForm) {
    if (form.valid){
      const post: Post = {
       title: form.value.title,
       content: form.value.content
      };
      this.postCreated.emit(post);
      // figure out how to clear the fields after subitting
    } else {
      return;
    }
  }
}
