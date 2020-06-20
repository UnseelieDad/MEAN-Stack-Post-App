import { Component } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  newPost: string;
 
  onAddPost() {
    this.newPost = 'The user\'s post.';
  }
}
