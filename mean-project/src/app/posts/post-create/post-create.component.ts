import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit{

  private mode = 'create';
  private postId: string;
  post: Post;

  constructor(private postsService: PostsService, private route: ActivatedRoute) {}

  // function  for adding a post to the site
  onAddPost(form: NgForm) {
    if (form.valid){
    
      if (this.mode ==='create') {
        this.postsService.addPost(form.value.title, form.value.content);
      } else {
        this.postsService.updatePost(this.postId, form.value.title, form.value.content);
      }
    
      form.resetForm();
    } else {
      return;
    }
  }

  ngOnInit() {
    // Param map is a built in observable
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      // Check for a post id in the route path for editing
      if (paramMap.has('postId')) {
        // If the postId exists, get that post for edting
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // getPostById returns an observable with the updated post fetched from the server
        this.postsService.getPostById(this.postId).subscribe(postData => {
          this.post = { id: postData._id, title: postData.title, content: postData.content }
        });
      } else {
        // If there's no id, just make a new post
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
}
