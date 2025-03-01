import { ScrapedContent } from 'src/interfaces/scraper.interface';
import { sourceConfigs } from '../ds/getCronSources';
import { FireCrawlScraper } from '../lib/crawler';

export default function () {}

export const fireCrawlTask = async () => {
  const firecrawlClent = new FireCrawlScraper();
  const source = sourceConfigs.AI.firecrawl;

  firecrawlClent.init();
  console.log('Firecrawl task is running');

  let rt: ScrapedContent[] = [];
  for (const s of source) {
    try {
      const content = await firecrawlClent.scrape(s.identifier);
      console.log(content);
      rt = rt.concat(content);
    } catch (e) {
      console.error(e);
    }
  }
  return rt;
};
