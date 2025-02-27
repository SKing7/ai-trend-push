export type NewsType = 'AI' | 'Tech' | 'Crypto' | 'All';
export type NewsPlatform = 'firecrawl' | 'twitter';

interface SourceItem {
  identifier: string;
}

interface PlatformSources {
  firecrawl: SourceItem[];
  twitter: SourceItem[];
}

type SourceConfig = Record<NewsType, PlatformSources>;

// 本地源配置
export const sourceConfigs: SourceConfig = {
  AI: {
    firecrawl: [
      { identifier: 'https://www.anthropic.com/news' },
      { identifier: 'https://news.ycombinator.com/' },
      {
        identifier:
          'https://www.reuters.com/technology/artificial-intelligence/',
      },
      { identifier: 'https://simonwillison.net/' },
      { identifier: 'https://buttondown.com/ainews/archive/' },
      { identifier: 'https://www.aibase.com/zh/daily' },
      { identifier: 'https://www.aibase.com/zh/news' },
    ],
    twitter: [
      { identifier: 'https://x.com/OpenAIDevs' },
      { identifier: 'https://x.com/xai' },
      { identifier: 'https://x.com/alexalbert__' },
      { identifier: 'https://x.com/leeerob' },
      { identifier: 'https://x.com/v0' },
      { identifier: 'https://x.com/aisdk' },
      { identifier: 'https://x.com/firecrawl_dev' },
      { identifier: 'https://x.com/AIatMeta' },
      { identifier: 'https://x.com/googleaidevs' },
      { identifier: 'https://x.com/MistralAI' },
      { identifier: 'https://x.com/Cohere' },
      { identifier: 'https://x.com/karpathy' },
      { identifier: 'https://x.com/ylecun' },
      { identifier: 'https://x.com/sama' },
      { identifier: 'https://x.com/EMostaque' },
      { identifier: 'https://x.com/DrJimFan' },
      { identifier: 'https://x.com/nickscamara_' },
      { identifier: 'https://x.com/CalebPeffer' },
      { identifier: 'https://x.com/akshay_pachaar' },
      { identifier: 'https://x.com/ericciarla' },
      { identifier: 'https://x.com/amasad' },
      { identifier: 'https://x.com/nutlope' },
      { identifier: 'https://x.com/rauchg' },
      { identifier: 'https://x.com/vercel' },
      { identifier: 'https://x.com/LangChainAI' },
      { identifier: 'https://x.com/llama_index' },
      { identifier: 'https://x.com/pinecone' },
      { identifier: 'https://x.com/modal_labs' },
      { identifier: 'https://x.com/huggingface' },
      { identifier: 'https://x.com/weights_biases' },
      { identifier: 'https://x.com/replicate' },
    ],
  },
  Tech: {
    firecrawl: [],
    twitter: [],
  },
  Crypto: {
    firecrawl: [],
    twitter: [],
  },
  All: {
    firecrawl: [],
    twitter: [],
  },
} as const;
