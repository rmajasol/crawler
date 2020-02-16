import URLParse = require('url-parse');


export default class URL extends URLParse{

    constructor(url: string, private parent: URL = null) {
        super(url)

        // If url starts with slash, it has no parent
        if (this.startsWith('/')) {
            this.parent = null
        } else {
            this.parent = parent
        }
    }

    public setParent(url: URL): void {
        this.parent = url
    }

    public isAbsoluteUrl(): boolean {
        return this.origin != 'null'
    }

    public isAbsolutePath(): boolean {
        return this.pathname.startsWith('/')
    }

    public startsWith(str: string): boolean {
        return this.toString().startsWith(str)
    }

    public isInternalPathFrom(url: URL): boolean {
        const isAbsoluteSameOrigin = this.isAbsoluteUrl() && this.origin == url.origin
        return this.hasPath() && (isAbsoluteSameOrigin || !this.isAbsoluteUrl()) 
    }

    /**
     * Returns full url from given baseUrl, e.g. /opinion/madrid/ returns:
     *      http://www.elpais.com/opinion/madrid
     * @param baseUrl 
     */
    public getFullUrl(baseUrl: URL): string {
        if (this.isAbsoluteUrl())
            return this.toString()
        return baseUrl.origin + '/' + this.toSymbolPath('/')
    }

    public getBaseUrl(): string {
        if (this.origin == "") {
            throw new Error(`URL provided '${this.href}' has no base url`)
        }
        return this.origin
    }

    public isRootPath(): boolean {
        return this.pathname == '/'
    }

    public hasPath(): boolean {
        if (this.isRootPath())
            return true

        const path = this.pathname.split('/')
        for (const section of path) {
            if (section) {
                return true
            }
        }
        return false 
    }

    public toSymbolPath(symbol: string = '.'): string {
        let path = []
        const urlPath = this.pathname.split('/')
        for (const section of urlPath) {
            if (section) {
                path.push(section)
            }
        }
        let symbolPath = ''
        if (this.parent) {
            const parentSymbolPath = this.parent.toSymbolPath(symbol)
            if (parentSymbolPath)
                symbolPath += parentSymbolPath + symbol
        }
        symbolPath += path.join(symbol)
        return symbolPath
    }

    public toDotPath(): string {
        return this.toSymbolPath()
    }
}