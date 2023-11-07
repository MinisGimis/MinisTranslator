import { Component } from '@angular/core';
import { OpenaiService } from 'src/app/services/openai/openai.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  userText: string = '';
  response: any;

  constructor(private openaiService: OpenaiService) {}

  public translateText(text: string): void {
    if (!text) {
      console.log('No text provided for translation.');
      return;
    }

    // Call the OpenAI service to translate the text
    this.openaiService.translate(text).subscribe({
      next: (response) => {
        // Handle the response here
        this.response = response;
        console.log('Translation:', this.response);
      },
      error: (error) => {
        // Handle any errors here
        console.error('Error translating text:', error);
      },
    });
  }
}
