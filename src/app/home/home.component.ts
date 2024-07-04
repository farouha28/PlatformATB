import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <video class="animated-video" autoplay muted loop>
      <source src="/assets/video.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
   
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

}
