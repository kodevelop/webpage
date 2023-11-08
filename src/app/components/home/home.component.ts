import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  themeToggle: HTMLInputElement | undefined;

  ngOnInit(): void {
    const heroImage = document.getElementById('hero-image') as HTMLDivElement;

    this.themeToggle = document.getElementById('theme-toggle') as HTMLInputElement;
    this.themeToggle.addEventListener('change', () => {
      if (this.themeToggle?.checked) {
        heroImage.style.backgroundImage = "url(../../../assets/img/hero-dark.png)";
      } else {
        heroImage.style.backgroundImage = "url(../../../assets/img/hero-light.png)";
      }
    });
  }
}
