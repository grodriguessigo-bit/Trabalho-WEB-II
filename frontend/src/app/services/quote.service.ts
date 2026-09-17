import { Injectable } from '@angular/core';
import { Quote } from '../shared/models/quote';

const LS_KEY = "quotes";

@Injectable({
  providedIn: 'root',
})
export class QuoteService {

  listAll(): Quote[] {
    const quotes = localStorage.getItem(LS_KEY);

    if (!quotes) {
      return [
        new Quote(
          1,
          5,
          1,
          450,
          '2026-09-15T10:00:00',
        ),
      ];
    }

    return JSON.parse(quotes);
  }

  insert(quote: Quote): void {
    const quotes = this.listAll();

    quote.id = this.generateId(quotes);

    quotes.push(quote);

    this.saveAll(quotes);
  }

  findByRequestId(requestId: number): Quote | undefined {
    return this.listAll().find(
      quote => quote.requestId === requestId
    );
  }

  private saveAll(quotes: Quote[]): void {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify(quotes)
    );
  }

  private generateId(quotes: Quote[]): number {

    if (quotes.length === 0) {
      return 1;
    }

    const highestId = Math.max(...quotes.map(quote => quote.id));

    return highestId + 1;
  }

}