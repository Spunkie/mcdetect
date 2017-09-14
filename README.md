# mcdetect - catch mixed content issues in the wild

_mcdetect_ is a tool to detect [mixed content issues](https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content)
with confidence.

![mcdetect demo](demo.gif)

## Motivation

Tools used to catch mixed content issues often rely
on parsing the DOM to determine if insecure content _will_ be loaded in a specific
page. Consequently they may report false negatives since not all such issues
can be detected statically.

_mcdetect_ can determine with absolute certainty if any mixed content
errors or warnings actually occur on a page. It does this by visiting
the pages and evaluating their Javascript like a regular browser would do.

It is uses [Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome)
that shipped with Chrome 59 and the [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).

## Requirements

- Chrome 59 or later
- Node 7.6.0 or later

## Installation

TODO

## Usage

Checking a single target page:

```shell
$ mcdetect https://example.com https://google.com
```

Checking multiple targets (the protocol can be omitted):
```shell
$ mcdetect example.com google.com
```

Multiple targets can also be given via a config file:

```shell
$ cat my_urls.json
{
  "targets": [
    "https://googlesamples.github.io/web-fundamentals/fundamentals/security/prevent-mixed-content/xmlhttprequest-example.html",
    "https://googlesamples.github.io/web-fundamentals/fundamentals/security/prevent-mixed-content/passive-mixed-content.html"
  ]
}

$ mcdetect --config my_urls.json
```

For more usage examples see `mcdetect --help`.

## TODO

- Add scraping mode (with max depth)
- More output formats (eg. json, csv, pdf)
- error handling (modes: exit on error, ignore errors, report errors)
- interactive mode
- follow redirects
- read targets from stdin

## License

mcdetect is licensed under MIT. See [LICENSE](LICENSE).
