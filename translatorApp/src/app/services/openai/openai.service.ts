import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OpenAIModels, OpenAIResponse } from 'src/app/types';

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
      model: OpenAIModels[0],
      messages: [
        { role: 'system', content: 'you are a translator.' },
        {
          role: 'user',
          content: `Translate the following text to English: `,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      max_tokens: 5000,
      n: 1,
    };
    return this.http
      .post<OpenAIResponse>(this.apiEndpoint, body, { headers })
      .pipe(
        map((response) => {
          // Extract the array of messages from the response
          return response.choices.map((choice) => choice.message.content);
        })
      );
  }
}
