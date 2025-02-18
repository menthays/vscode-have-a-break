import * as https from 'https';
import { fallbackQuotes } from '../constants';

export interface Quote {
    text: string;
    author: string | null;
}

// Get a random fallback quote
function getRandomFallbackQuote(): Quote {
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
}

// Fetch a random quote from the API
export async function fetchRandomQuote(): Promise<Quote> {
    return new Promise((resolve) => {
        https.get('https://type.fit/api/quotes', (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const quotes = JSON.parse(data) as Quote[];
                    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                    resolve({
                        text: randomQuote.text,
                        author: randomQuote.author || "Unknown"
                    });
                } catch (e) {
                    resolve(getRandomFallbackQuote());
                }
            });
        }).on('error', () => {
            resolve(getRandomFallbackQuote());
        });
    });
}
