import {
  ContentScraper,
  ScrapedContent,
} from '../interfaces/scraper.interface';
import dotenv from 'dotenv';
import { z } from 'zod';
import FirecrawlApp from 'firecrawl';
const FIRE_CRAWL_API_KEY = process.env.FIRE_CRAWL_API_KEY;

dotenv.config();

// 使用 zod 定义数据结构
const StorySchema = z.object({
  headline: z.string(),
  content: z.string(),
  link: z.string(),
  date_posted: z.string(),
});

const StoriesSchema = z.object({
  stories: z.array(StorySchema),
});

export class FireCrawlScraper implements ContentScraper {
  private app!: FirecrawlApp;

  constructor() {
    this.refresh();
  }

  refresh() {
    this.app = new FirecrawlApp({
      apiKey: FIRE_CRAWL_API_KEY,
    });
  }

  private generateId(url: string): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const urlHash = url.split('').reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
    }, 0);
    return `fc_${timestamp}_${random}_${Math.abs(urlHash)}`;
  }

  async scrape(sourceId: string): Promise<ScrapedContent[]> {
    try {
      const currentDate = new Date().toLocaleDateString();

      // 构建提取提示词
      const promptForFirecrawl = `
        Return only today's AI or LLM related story or post headlines and links in JSON format from the page content. 
        They must be posted today, ${currentDate}. The format should be:
          {
            "stories": [
              {
                "headline": "headline1",
                "content":"content1"
                "link": "link1",
                "date_posted": "YYYY-MM-DD HH:mm:ss",
              },
              ...
            ]
          }
        If there are no AI or LLM stories from today, return {"stories": []}.
        
        The source link is ${sourceId}. 
        If a story link is not absolute, prepend ${sourceId} to make it absolute. 
        Return only pure JSON in the specified format (no extra text, no markdown, no \\\\).  
        The content should be about 500 words, which can summarize the full text and the main point.
        Translate all into Chinese.
        !!
        `;

      // 使用 FirecrawlApp 进行抓取
      const scrapeResult = await this.app.scrapeUrl(sourceId, {
        formats: ['extract'],
        extract: {
          prompt: promptForFirecrawl,
          schema: StoriesSchema,
        },
      });

      if (!scrapeResult.success || !scrapeResult.extract?.stories) {
        throw new Error(scrapeResult.error || '未获取到有效内容');
      }

      // 使用 zod 验证返回数据
      const validatedData = StoriesSchema.parse(scrapeResult.extract);

      // 转换为 ScrapedContent 格式
      console.log(
        `[FireCrawl] 从 ${sourceId} 获取到 ${validatedData.stories.length} 条内容`,
      );
      return validatedData.stories.map((story) => ({
        id: this.generateId(story.link),
        title: story.headline,
        content: story.content,
        url: story.link,
        publishDate: '',
        score: 0,
        metadata: {
          source: 'fireCrawl',
          originalUrl: story.link,
          datePosted: story.date_posted,
        },
      }));
    } catch (error) {
      console.error('FireCrawl抓取失败:', error);
      throw error;
    }
  }
}
