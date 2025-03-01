import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';
import { WeixinTemplate } from 'src/interfaces/tempate.interface';

export class WeixinTemplateRenderer {
  private template: string;

  constructor() {
    // 读取模板文件
    const templatePath = path.join(process.cwd(), 'src/templates/article.ejs');
    this.template = fs.readFileSync(templatePath, 'utf-8');
  }

  /**
   * 渲染微信文章模板
   * @param articles 微信文章模板数组
   * @returns 渲染后的 HTML
   */
  render(articles: WeixinTemplate[]): string {
    try {
      // 使用 EJS 渲染模板
      const renderedTemplate = ejs.render(
        this.template,
        { articles },
        {
          rmWhitespace: true,
        },
      );
      if (typeof renderedTemplate !== 'string') {
        throw new Error('模板渲染失败: 渲染结果不是字符串');
      }
      return renderedTemplate;
    } catch (error) {
      console.error('模板渲染失败:', error);
      throw error;
    }
  }
}
