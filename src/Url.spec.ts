import URL from './Url';
import { expect } from 'chai';
import 'mocha';

const baseUrl = new URL('http://www.elpais.com')
const baseUrlTrailingSlash = new URL('http://www.elpais.com/')
const baseUrlWithPath = new URL('http://www.elpais.com/path')

describe('URL', () => {
    describe('#isAbsoluteUrl()', () => {
        const absoluteUrls = [
            'https://www.example.com/',
            'http://www.example.com/',
            'http://example.com',
            'https://example.com',
            'https://example.com//'
        ]
        for (const url of absoluteUrls) {
            it(`should return true when url is ${url}`, () => {
                const u = new URL(url)
                expect(u.isAbsoluteUrl()).to.be.true
            });
        }

        const nonAbsoluteUrls = [
            'opinion',
            'opinion/',
            'opinion/madrid',
            'example.com/',
            'www.example.com/',
            '//EXAMPLE.COM',
            'foo.EXAMPLE.COM'
        ]
        for (const url of nonAbsoluteUrls) {
            it(`should return false when url is ${url}`, () => {
                const u = new URL(url)
                expect(u.isAbsoluteUrl()).to.be.false
            });
        }
    });

    describe(`#isInternalPathFrom(${baseUrl.toString()})`, () => {
        const internals = [
            '/foo/bar',
            'foo/bar',
            'foo',
            'http://www.elpais.com/opinion/'
        ]
        for (const url of internals) {
            it(`should return true when url is ${url}`, () => {
                const u = new URL(url)
                expect(u.isInternalPathFrom(baseUrl)).to.be.true
            });
        }

        const nonInternals = [
            'http://www.foo.com',
            '//foo',
            '#foo',
            '?foo'
        ]
        for (const url of nonInternals) {
            it(`should return false when url is ${url}`, () => {
                const u = new URL(url)
                expect(u.isInternalPathFrom(baseUrl)).to.be.false
            });
        }
    })

    describe(`#toSymbolPath(/)`, () => {
        const getTestStatement = function (test) {
            let statement = `Should return '${test.expected}' when url is '${test.url.toString()}'`
            if (test.url.parent) {
                statement += ` and with parent ${test.url.parent.toString()}`
            } else {
                statement += ` without parent`
            }
            return statement
        }

        const tests = [
            {
                url: new URL('/opinion/madrid'),
                expected: 'opinion/madrid'
            },
            {
                url: new URL('/opinion/madrid', baseUrl),
                expected: 'opinion/madrid'
            },
            {
                url: new URL('/opinion/madrid', baseUrlTrailingSlash),
                expected: 'opinion/madrid'
            },
            {
                url: new URL('///opinion/madrid//', baseUrlTrailingSlash),
                expected: 'opinion/madrid'
            },
            {
                url: new URL('/opinion/madrid//////', baseUrlTrailingSlash),
                expected: 'opinion/madrid'
            },
            {
                url: new URL('opinion/madrid', baseUrlWithPath),
                expected: 'path/opinion/madrid'
            },
            {
                url: new URL('/opinion/madrid', baseUrlWithPath),
                expected: 'opinion/madrid'
            }
        ]
        tests.forEach((test) => {
            it(getTestStatement(test), () => {
                expect(test.url.toSymbolPath('/')).to.be.equal(test.expected)
            });
        })
    })

    describe(`#getFullUrl(${baseUrl.toString()})`, () => {
        const expectedResults = {
            '/foo/bar': baseUrl.origin + '/foo/bar',
            'foo/bar': baseUrl.origin + '/foo/bar',
            'foo': baseUrl.origin + '/foo',
            'http://www.elpais.com/opinion/': baseUrl.origin + '/opinion/'
        }
        for (const url in expectedResults) {
            it(`When url is '${url}', it should return '${expectedResults[url]}'`, () => {
                const u = new URL(url, baseUrl)
                expect(u.getFullUrl(baseUrl)).to.be.equal(expectedResults[url])
            });
        }
    })

    describe(`#getFullUrl(${baseUrl.toString()}/)`, () => {
        const baseUrlTrailingSlash = new URL(`${baseUrl.toString()}/`)
        const expectedResults = {
            '/foo/bar': baseUrlTrailingSlash.origin + '/foo/bar',
            'foo/bar': baseUrlTrailingSlash.origin + '/foo/bar',
            'foo': baseUrlTrailingSlash.origin + '/foo',
            'http://www.elpais.com/opinion/': baseUrlTrailingSlash.origin + '/opinion/'
        }
        for (const url in expectedResults) {
            it(`When url is '${url}', it should return '${expectedResults[url]}'`, () => {
                const u = new URL(url, baseUrl)
                expect(u.getFullUrl(baseUrl)).to.be.equal(expectedResults[url])
            });
        }
    })
})