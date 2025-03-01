import {
  ContentScraper,
  ScrapedContent,
} from '../interfaces/scraper.interface';
import { z } from 'zod';
import FirecrawlApp, { ScrapeResponse } from 'firecrawl';
import { getConfigService } from '../lib/config';

// 使用 zod 定义数据结构
const StorySchema = z.object({
  headline: z.string(),
  content: z.string(),
  digest: z.string(),
  link: z.string(),
  date_posted: z.string(),
});

const StoriesSchema = z.object({
  stories: z.array(StorySchema),
});

export class FireCrawlScraper implements ContentScraper {
  private app!: FirecrawlApp;

  init() {
    const configService = getConfigService();
    this.app = new FirecrawlApp({
      apiKey: configService.get('FIRE_CRAWL_API_KEY'),
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

  async crawler(url: string) {
    const scrapeResult = (await this.app.scrapeUrl(url, {
      formats: ['html'],
    })) as ScrapeResponse;
    return scrapeResult.html;
  }

  async scrape(sourceId: string): Promise<ScrapedContent[]> {
    try {
      const currentDate = new Date().toLocaleDateString();

      // 构建提取提示词
      const promptForFirecrawl = `
        请按照以下prompt 提取 AI 或 LLM 相关的新闻内容，最好是中文或者你把结果翻译成中文
        Return only today's AI or LLM related story or post headlines and links in JSON format from the page content. 
        They must be posted today, ${currentDate}. The format should be:
          {
            "stories": [
              {
                "headline": "headline1",
                "content":"content1"
                "link": "link1",
                "digest": "content2",
                "date_posted": "YYYY-MM-DD HH:mm:ss",
              },
              ...
            ]
          }
        If there are no AI or LLM stories from today, return {"stories": []}.
        
        Return only pure JSON in the specified format (no extra text, no markdown, no \\\\).  
        The content should be about 500 words, which can summarize the full text and the main point.
        The digest should be less than 50 words, which can summarize the full text and the main point.
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
        publishDate: story.date_posted,
        digest: story.digest,
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
