# Crawly AI

Crawly AI is a super simple, lightweight tool for AI-powered web scraping. It’s designed to make web scraping with LLMs as easy as possible—no complicated setup needed. Just fire up the scraper built on top of Cheerio, and choose an LLM to work with. Right now, Crawly supports Gemini models, but I’m planning to add support for models like GPT-4, Claude, and more soon.

## Features

- Extracts text from web pages using Cheerio
- Analyzes extracted text using Google's Generative AI models
- Supports multiple Gemini models for different use cases
- Easy to use and integrate into your projects

## Installation

To install Crawly AI, use npm:

```sh
npm install crawly-ai
```

### Usage

Here is an example of how to use Crawly AI:

```typescript
import { Crawler, GeminiAdapter, GeminiModels } from "crawly-ai";

async function main() {
  // Create a new GeminiAdapter instance with your API key and chosen model
  const gemini = new GeminiAdapter(
    "YOUR_GOOGLE_GENERATIVE_AI_API_KEY", // Replace with your actual API key
    GeminiModels.GEMINI_1_5_FLASH // Choose the model that suits your needs
  );

  // URL of the web page to scrape
  const url = "https://www.example.com";

  // Create a new crawler instance with LLM adapter and strict mode enabled
  const crawler = new Crawler(gemini, true);

  try {
    // Define your prompt for the AI analysis
    const prompt = "Provide a summary of the key points in JSON format.";

    // Scrape and analyze the content in one step
    const result = await crawler.scrape(prompt, url);

    // Output the result
    console.log("Analysis Result:", result);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
```

**Notes:**

- **API Key:** Replace `"YOUR_GOOGLE_GENERATIVE_AI_API_KEY"` with your actual API key from Google Generative AI.
- **URL:** Change the url variable to the web page you want to scrape.
- **Prompt:** Customize the `prompt` variable to fit your specific use case.
- **Error Handling:** The try-catch block ensures that any errors during scraping or analysis are caught and logged.

## API

### Crawler

#### `constructor(url: string, strict: boolean = true)`

Creates an instance of Crawler.

- `url`: The URL to scrape.
- `strict`: Whether to perform strict cleaning of the extracted text (default is true).

#### `extractText(): Promise<string>`

Extracts and cleans text from the URL.

### GeminiAdapter

#### `constructor(apiKey: string, model: GeminiModels)`

Creates an instance of GeminiAdapter.

- `apiKey`: Your Google Generative AI API key.
- `model`: The Gemini model to use.

#### `analyseText(text: string, prompt: string): Promise<string>`

Analyzes text using the specified Gemini model and prompt.

## Models

### GeminiModels

Enum representing the available Gemini models:

- `GEMINI_1_5_FLASH`: Fast and versatile performance across a variety of tasks.
- `GEMINI_1_5_FLASH_8B`: High volume and lower intelligence tasks.
- `GEMINI_1_5_PRO`: Complex reasoning tasks requiring more intelligence.
- `GEMINI_1_0_PRO`: Natural language tasks, multi-turn text and code chat, and code generation.
- `TEXT_EMBEDDING`: Measuring the relatedness of text strings.
- `AQA`: Providing source-grounded answers to questions.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## Author

Mateo Sanchez - [mateosanchez.msl@gmail.com](mailto:mateosanchez.msl@gmail.com)
