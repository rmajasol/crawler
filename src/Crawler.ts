import axios from 'axios';
const cheerio = require('cheerio')
const _ = require('lodash')
const flatten = require('flat')
const treeify = require('treeify');
const PromisePool = require('es6-promise-pool')
const fs = require('fs');

import URL from './Url'
import { url } from 'inspector';


interface Dictionary<T> {
    [Key: string]: T;
}

class FetchError extends Error {}

class LimitReachedException extends Error{
    constructor (size: number, limit: number) {
        super(`Cannot process more urls. Limit reached (${size}/${limit})`)
    }
}


export default class Crawler {
    private websiteTree: Dictionary<string>
    private baseUrl: URL
    private isLimitAlreadyWarned: boolean

    constructor(
        website: string,
        private concurrency: number = 1,
        private limit: number = null,
        private file: string = null
    ){
        this.baseUrl = new URL(this.sanitizeWebsite(website))
        this.websiteTree = {}
        this.isLimitAlreadyWarned = false
    }

    private sanitizeWebsite(website: string): string {
        if (!website.includes('://')) {
            website = 'https://' + website
        }
        return website
    }

    private fetchUrl(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get(url)
                .then(function (response) {
                    return resolve(response)
                })
                .catch(function (error) {
                    return reject(new FetchError(`Error fetching url: ${url}`))
                })
        })
    }

    /**
     * Returns url list found inside given body
     * @param body
     */
    private getUrls(body: string): Array<string> {
        let urls = []
        const $ = cheerio.load(body)
        $('a').each((i, element) => {
            let $el = $(element)
            if ($el){
                let url = $el.attr('href')
                urls.push(url)
            }
        })
        return urls
    }

    private getDotPath(url: URL): string {
        return url.pathname == '/' ? '/' : '/.' + url.toDotPath()
    }

    /**
     * Adds given url to websiteTree, e.g. /opinion/madrid/ modifies websiteTree with new state:
     *  websiteTree = {
     *      'opinion': {
     *          'madrid': {},
     *          ...
     *      },
     *      ...
     *  }
     * @param url
     */
    private addToWebsiteTree(url: URL): void {
        if (!this.isInWebsiteTree(url)) {
            _.set(this.websiteTree, this.getDotPath(url), {})
            // console.debug(`Added to url tree: ${this.getDotPath(url)}`)
        }
    }

    /**
     * Checks if given url is already in url tree
     * @param url
     */
    private isInWebsiteTree(url: URL): boolean {
        return _.get(this.websiteTree, this.getDotPath(url)) !== undefined
    }

    private checkLimitReached(): boolean {
        if (!this.limit)
            return
        const size = this.getWebsiteTreeSize()
        if (size >= this.limit) {
            throw new LimitReachedException(size, this.limit)
        }
    }

    private renderProcessedCount(): string {
        const size = this.getWebsiteTreeSize()
        if (this.limit)
            return `(${size}/${this.limit})`
        return `(${size})`
    }

    private getWebsiteTreeSize(): number {
        return _.size(flatten(this.websiteTree)) - 1  // Substracts '/' key
    }

    private async processUrls(urls: Array<string>, parentUrl: URL): Promise<any> {
        try {
            this.checkLimitReached()
            console.debug(`Processing urls for url: ${parentUrl.toString()}`)
            const me = this
            const generatePromises = function * () {
                for (let url of urls) {
                    const u = new URL(url)
                    if (!u.isAbsolutePath()) {
                        u.setParent(parentUrl)
                    }
                    yield me.processUrl(u)
                }
            }
            const promiseIterator = generatePromises()
            const pool = new PromisePool(promiseIterator, this.concurrency)
            return pool.start()
        } catch (error) {
            this.checkError(error)
        }
    }

    private async processUrl(url: URL = this.baseUrl): Promise<void> {
        if (!url.isInternalPathFrom(this.baseUrl))
            return
        if (this.isInWebsiteTree(url))
            return

        try {
            this.checkLimitReached()
            this.addToWebsiteTree(url)
            const response = await this.fetchUrl(url.getFullUrl(this.baseUrl))
            const subUrls = this.getUrls(response.data)
            if (subUrls) {
                await this.processUrls(subUrls, url)
                console.debug(`Urls processed for url: ${url.toString()} ${this.renderProcessedCount()}`)
            }
        } catch (error) {
            this.checkError(error)
        }
    }

    private checkError(error: Error): void {
        if (error instanceof FetchError) {
            console.warn(error)
            return 
        }
        if (error instanceof LimitReachedException) {
            if (!this.isLimitAlreadyWarned) {
                this.isLimitAlreadyWarned = true
                console.warn(error)
            }
            return
        }
        throw error
    }

    public async getWebsiteTree(): Promise<Object> {
        await this.processUrl()
        if (this.getWebsiteTreeSize() == 0) {
            console.warn(`Could not generate website tree for website: ${this.baseUrl.toString()}`)
            return null
        }
        const websiteTree = this.websiteTree['/'] // removes '/' level
        const websiteTreeRendered = treeify.asTree(websiteTree)
        if (this.file) {
            const me = this
            fs.writeFile(this.file, websiteTreeRendered, function (error) {
                if (error) throw error;
                console.log(`Website tree was written to file: ${me.file}`);
            });
        } else {
            console.log(`-- WEBSITE TREE for ${this.baseUrl.toString()} --`)
            console.log(websiteTreeRendered)
        }
        return websiteTree
    }
}
