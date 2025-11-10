import { Component } from '@angular/core';
import { Header } from '../share/header/header';
import { Footer } from '../share/footer/footer';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

  // Example logout method
  logout() {
    // Clear any user/session data here
    localStorage.removeItem('token');  // if you store JWT
    console.log('User logged out');
    // Optionally redirect to login page
    this.router.navigate(['/login']);
  }
}
