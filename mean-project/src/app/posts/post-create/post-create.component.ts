import { Component, EventEmitter, Output} from '@angular/core';

import { Post } from '../post.model';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  enteredContent = '';
  enteredTitle = '';
  @Output() postCreated = new EventEmitter<Post>();

  // function  for adding a post to the site
  onAddPost() {
   const post: Post = {
     title: this.enteredTitle,
     content: this.enteredContent
   };
   this.postCreated.emit(post);
   this.enteredContent = '';
   this.enteredTitle = '';
  }
}
