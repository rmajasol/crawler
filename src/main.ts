import Crawler from './Crawler';
import { Command } from 'commander';
const command = new Command();

command
  .version('1.0.0')
  .requiredOption('-w, --website <website>', 'Add website URL to crawl')
  .option('-c, --concurrency <concurrency>', 'Define concurrency level')
  .option('-l, --limit <limit>', 'Define max items for url tree')
  .option('-f, --file <file>', 'Define file path to write website tree')
  .parse(process.argv);

const crawler = new Crawler(command.website, +command.concurrency, +command.limit, command.file)
crawler.getWebsiteTree()

