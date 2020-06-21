import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit{

  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  constructor(private postsService: PostsService, private route: ActivatedRoute) {}

  // function  for adding a post to the site
  onAddPost() {
    if (this.form.valid){
      // Start loading spinner
      this.isLoading = true;
      if (this.mode === 'create') {
        this.postsService.addPost(this.form.value.title, this.form.value.content);
      } else {
        this.postsService.updatePost(
          this.postId, 
          this.form.value.title, 
          this.form.value.content
        );
      }

      this.form.reset();
    } else {
      return;
    }
  }

  // When the user chooses an image to upload from the file picker
  onImagePicked(event: Event) {
    // Angular doesn't inherently know that event is a file input
    const file = (event.target as HTMLInputElement).files[0];
    // patchValue allows for targeting a single control on a form
    this.form.patchValue({ image: file });
    // Update value and validity of the newly added image
    this.form.get('image').updateValueAndValidity();
    // Convert image to data URL for the image tag
    const reader = new FileReader();
    // When the reader loads, set the image preview as the result
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    // Kick off the onload function with the uploaded file
    reader.readAsDataURL(file);
  }

  ngOnInit() {
    // A reactive form to use for validating posts
    // Initial values are null unless the post is being edited
    this.form = new FormGroup({
      title: new FormControl(null, { 
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      // No need to bind this to an html element
      image: new FormControl(null, { 
        validators: [Validators.required],
        asyncValidators: [mimeType] // use the created mimeType validator to validate the image file
      })
    });

    // Param map is a built in observable
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      // Check for a post id in the route path for editing
      if (paramMap.has('postId')) {
        // If the postId exists, get that post for edting
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // show progress spinner
        this.isLoading = true;
        // getPostById returns an observable with the updated post fetched from the server
        this.postsService.getPostById(this.postId).subscribe(postData => {
          // stop progress spinner
          this.isLoading = false;
          this.post = { 
            id: postData._id, 
            title: postData.title, 
            content: postData.content 
          }
          // Set form values to old post values when editing
          this.form.setValue({ 
            'title': this.post.title, 
            'content': this.post.content 
          });
        });
      } else {
        // If there's no id, just make a new post
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
}
