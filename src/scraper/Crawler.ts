import * as cheerio from "cheerio";
import axios from "axios";
import { LLMAdapter } from "../llm/LLMAdapter";

/**
 * Crawler class that combines web scraping with LLM-powered analysis.
 * It extracts text content from web pages and processes it using a language model.
 *
 * @example
 * ```typescript
 * const gemini = new GeminiAdapter(apiKey, GeminiModels.GEMINI_1_5_FLASH);
 * const crawler = new Crawler(gemini);
 * const result = await crawler.scrape("Analyze this text:", "https://example.com");
 * ```
 */
export class Crawler {
  /**
   * Controls the aggressiveness of HTML cleaning.
   * When true, removes more elements like iframes, nav, hidden elements.
   * @private
   */
  private strict: boolean;

  /**
   * Language model adapter used for text analysis.
   * Must implement the LLMAdapter interface.
   * @private
   */
  private model: LLMAdapter;

  /**
   * Creates a new Crawler instance.
   * @param model - Language model adapter for text analysis
   * @param strict - Whether to use strict HTML cleaning (default: true)
   */
  constructor(model: LLMAdapter, strict: boolean = true) {
    this.strict = strict;
    this.model = model;
  }

  /**
   * Scrapes a webpage and analyzes its content using the configured language model.
   *
   * @param prompt - Instructions for the language model on how to analyze the text
   * @param url - URL of the webpage to scrape
   * @returns Promise resolving to the language model's analysis
   * @throws {Error} If scraping or analysis fails
   *
   * @example
   * ```typescript
   * const result = await crawler.scrape(
   *   "Summarize the main points:",
   *   "https://example.com"
   * );
   * ```
   */
  public async scrape(prompt: string, url: string): Promise<string> {
    try {
      const text = await this.extractText(url);
      const result = await this.model.analyseText(text, prompt);
      return result;
    } catch (error) {
      throw new Error("Failed to scrape and analyze the URL. Please check the URL and try again.");
    }
  }

  /**
   * Extracts and cleans text content from a webpage.
   *
   * @param url - URL of the webpage to extract text from
   * @returns Promise resolving to the cleaned text content
   * @throws {Error} If the URL cannot be accessed or parsed
   *
   * @example
   * ```typescript
   * const text = await crawler.extractText("https://example.com");
   * ```
   */
  public async extractText(url: string): Promise<string> {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      return this.cleanText($);
    } catch (error) {
      throw new Error("Failed to extract text from the URL. Please check the URL and try again.");
    }
  }

  /**
   * Cleans HTML content by removing unwanted elements.
   * Uses strict or relaxed cleaning based on the instance configuration.
   *
   * @param $ - Cheerio instance containing the loaded HTML
   * @returns Cleaned and normalized text content
   * @private
   */
  private cleanText($: cheerio.CheerioAPI): string {
    $("script, style, footer, header").remove();

    if (this.strict) {
      $("iframe, nav, .hidden, [aria-hidden='true'], noscript, link, meta, img").remove();
    }

    const text = $("body").text();
    return text.replace(/\s+/g, " ").trim();
  }
}
