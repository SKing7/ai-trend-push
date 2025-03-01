import {
  ContentScraper,
  ScrapedContent,
} from '../interfaces/scraper.interface';
import { WeixinPublisher } from '../publishers/weixin.publisher';
import { FireCrawlScraper } from '../scrapers/firecrawl';
import { WeixinTemplateRenderer } from '../render/weixin.render';
import { sourceConfigs } from '../ds/getCronSources';
import { WeixinTemplate } from 'src/interfaces/tempate.interface';

export class WeixinWorkflow {
  private scraper: Map<string, ContentScraper>;
  private publisher: any;
  private renderer: WeixinTemplateRenderer;
  private stats = {
    success: 0,
    failed: 0,
    contents: 0,
  };

  constructor() {
    this.scraper = new Map<string, ContentScraper>();
    this.scraper.set('fireCrawl', new FireCrawlScraper());
    this.publisher = new WeixinPublisher();
    this.renderer = new WeixinTemplateRenderer();
  }

  async process() {
    const firecrawlClent = new FireCrawlScraper();
    const source = sourceConfigs.AI.firecrawl;

    firecrawlClent.init();
    console.log('Firecrawl task is running');

    let rt: ScrapedContent[] = [];
    for (const s of source) {
      try {
        console.log('Start Scrap:', s);
        const content = await firecrawlClent.scrape(s.identifier);
        rt = rt.concat(content);
      } catch (e) {
        console.error(e);
      }
    }

    let digests = '';
    const templateData: WeixinTemplate[] = rt.map((content) => {
      digests += content.title;
      return {
        id: content.id,
        title: content.title,
        content: content.content,
        url: content.url,
        publishDate: content.publishDate,
        metadata: content.metadata,
        keywords: content.metadata.keywords,
      };
    });
    const articalHtml = this.renderer.render(templateData);
    const wxPublisher = new WeixinPublisher();
    const imageId = await wxPublisher
      .uploadImage('http://localhost:8080/home/1.jpg')
      .catch((e) => {
        console.log(e);
      });

    await wxPublisher
      .publish(
        articalHtml,
        'AI 大事件 一天动态',
        digests.substring(0, 50) + '...',
        imageId || '',
        '',
      )
      .catch((e) => {
        console.log(e);
      });
  }
}
