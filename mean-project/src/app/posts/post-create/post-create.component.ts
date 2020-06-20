import { Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  enteredContent = '';
  enteredTitle = '';
  @Output() postCreated = new EventEmitter();

  // function  for adding a post to the site
  onAddPost() {
   const post = {
     title: this.enteredTitle,
     content: this.enteredContent
   };
   this.postCreated.emit(post);
   this.enteredContent = '';
   this.enteredTitle = '';
  }
}
