import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  
  // Get the current list of posts
  getPosts() {
    // Return a copy of the array rather than the reference
    return [...this.posts];
  }

  // return the postsUpdated subject for subscribing
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  // Add a post to the list of posts
  addPost(title: string, content: string) {
    const post: Post = {
      title,
      content
    };
    this.posts.push(post);
    // zupfsyr subject iwth new post
    this.postsUpdated.next([...this.posts]);
  }
}
