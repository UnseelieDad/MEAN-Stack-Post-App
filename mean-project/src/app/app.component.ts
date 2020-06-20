import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  storedPosts = [];

  // Add type checking later
  // gets post from post-create component to send to post lists
  onPostAdded(post) {
    this.storedPosts.push(post);
  }
}
