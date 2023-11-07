import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OpenaiService {
  // OpenAI API endpoint for chatgpt-3.5-turbo
  private apiEndpoint = 'https://api.openai.com/v1/chat/completions';

  // Insert your OpenAI API key in your environment variables
  private apiKey = environment.openaiApiKey;

  constructor(private http: HttpClient) {}

  public translate(text: string): Observable<any> {
    // Set up headers for the OpenAI API request
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    // Set up the data body for the API request
    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'you are a translator.' },
        {
          role: 'user',
          content: `Translate the following text to English: "${text}"`,
        },
      ],
      temperature: 0.3,
      max_tokens: 60,
      n: 1,
      stop: null,
      top_p: 1,
    };

    // Make the HTTP POST request and return the Observable
    return this.http.post(this.apiEndpoint, body, { headers });
  }
}
