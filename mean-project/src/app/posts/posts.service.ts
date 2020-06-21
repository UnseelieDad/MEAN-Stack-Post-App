import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}
  
  // Get the current list of posts from the server
  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
      .subscribe((postData) => {
        this.posts = postData.posts;
        // update subject with new posts
        this.postsUpdated.next([...this.posts]);
      });
  }

  // return the postsUpdated subject for subscribing
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  // Add a post to the list of posts
  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title,
      content
    };
    this.posts.push(post);
    // update subject withth new post
    this.postsUpdated.next([...this.posts]);
  }
}
