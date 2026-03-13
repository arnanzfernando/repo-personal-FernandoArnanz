// landing-page-component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Necesario para usar routerLink

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterModule], // Necesario para la navegación
  templateUrl: './landing-page-component.html'
})
export class LandingPageComponent { }
