import axios from "axios";
import { Crawler } from "../scraper/Crawler";
import { LLMAdapter } from "../llm/LLMAdapter";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock response for axios.get
mockedAxios.get.mockResolvedValue({
  data: "<html><body><p>Test content</p></body></html>",
});

class MockLLMAdapter implements LLMAdapter {
  apiKey = "test-api-key";

  analyseText(text: string, prompt: string): Promise<string> {
    return Promise.resolve("Mock analysis result");
  }
}

describe("Crawler", () => {
  let crawler: Crawler;
  const mockLLMAdapter = new MockLLMAdapter();
  const validUrl = "https://example.com";
  const invalidUrl = "invalid-url";
  const testPrompt = "Test prompt";

  beforeEach(() => {
    mockedAxios.get.mockClear();
  });

  test("should initialize with default strict value", () => {
    crawler = new Crawler(mockLLMAdapter);
    expect(crawler).toBeDefined();
  });

  test("should scrape and analyze text from a valid URL", async () => {
    crawler = new Crawler(mockLLMAdapter);
    const result = await crawler.scrape(testPrompt, validUrl);
    expect(mockedAxios.get).toHaveBeenCalledWith(validUrl);
    expect(result).toBe("Mock analysis result");
  });

  test("should throw an error for an invalid URL", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));
    crawler = new Crawler(mockLLMAdapter);
    await expect(crawler.scrape(testPrompt, invalidUrl)).rejects.toThrow(
      "Failed to scrape and analyze the URL. Please check the URL and try again."
    );
  });

  test("should respect the strict mode", async () => {
    crawler = new Crawler(mockLLMAdapter, false);
    const result = await crawler.scrape(testPrompt, validUrl);
    expect(result).toBe("Mock analysis result");
  });

  test("should extract text without analysis", async () => {
    crawler = new Crawler(mockLLMAdapter);
    const text = await crawler.extractText(validUrl);
    expect(text).toBeDefined();
    expect(typeof text).toBe("string");
    expect(text).toContain("Test content");
  });

  test("should handle text extraction errors", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));
    crawler = new Crawler(mockLLMAdapter);
    await expect(crawler.extractText(invalidUrl)).rejects.toThrow(
      "Failed to extract text from the URL. Please check the URL and try again."
    );
  });
});
