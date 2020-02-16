import Crawler from './Crawler';
import { expect } from 'chai';
import 'mocha';


describe('Crawler', () => {
    describe('#getWebsiteTree()', () => {
        it(`should return website tree for existing website`, async () => {
            const website = 'https://www.crawler-test.com/'
            const crawler = new Crawler(website, 1, 10)
            crawler.getWebsiteTree().then((tree) => {
                expect(tree).to.have.keys
            })
        });
        it(`should return website tree for existing website non-sanitized`, async () => {
            const website = 'crawler-test.com/'
            const crawler = new Crawler(website, 1, 5)
            crawler.getWebsiteTree().then((tree) => {
                expect(tree).to.have.keys
            })
        });
        it(`should return empty tree for non-existing website`, async () => {
            const website = 'http://testxx98797979xx.com/'
            const crawler = new Crawler(website, 1, 10)
            crawler.getWebsiteTree().then((tree) => {
                expect(tree).to.not.have.keys
            })
        });
    });
})