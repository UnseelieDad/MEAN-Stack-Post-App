import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, subscribeOn } from 'rxjs/operators';

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
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
    // Use pipe to execute the map operator on the observable from the backend
    // so that _id is formated as id
    .pipe(map(postData => {
      // for each post in postData, return a properly formated post
      return postData.posts.map(post => {
        return {
          id: post._id,
          title: post.title,
          content: post.content
        };
      });
    }))
    .subscribe((formatedPosts) => {
        this.posts = formatedPosts;
        // update subject with new posts
        this.postsUpdated.next([...this.posts]);
      });
  }

  // Get a post by its id
  getPostById(id: string) {
    // Can only return the observable here,
    // the rest is handled in post-create component
    return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
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
    this.http
      .post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const id = responseData.postId;
        // Set the post id to the generated id from the database
        post.id = id;
        // Only update posts locally if successfully added to the server
        this.posts.push(post);
        // update subject withth new post
        this.postsUpdated.next([...this.posts]);
      });
  }

  // Update a post after editing
  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content };
    this.http.patch('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response => {
        // If updaing on the backend is successful, update the post by its index
        // in the frontend array.
        const updatedPosts = [...this.posts];
        const oldPostInex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostInex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  // Delete a post
  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        // Keep all posts but the one with the deleted id
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
    });
  }
}
