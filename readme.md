# @barelyhuman/mocha-to-tap

Simple CLI/Node program to convert `@tapjs/mocha-global` tests to tap nested tests.

```js
describe("test", () => {
  describe("inner test", () => {
    describe("inner inner test", () => {
      it("why even check now", () => {});
    });
  });
});

// ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓ 

t.test("test", async (t) => {
  t.test("inner test", async (t) => {
    t.test("inner inner test", async (t) => {
      t.test("why even check now", async (t) => {});
    });
  });
});
```

- [@barelyhuman/mocha-to-tap](#barelyhumanmocha-to-tap)
  - [Usage](#usage)
  - [CLI Reference](#cli-reference)
  - [License](#license)

## Usage

```sh
; npm i -g @barelyhuman/mocha-to-tap
; mocha-to-tap '**/*.js'

# or

; npx -p @barelyhuman/mocha-to-tap mocha-to-tap '**/*.js'
```

## CLI Reference

```
Usage
    $ mocha-to-tap <glob> [options]

  Options
    -d, --dry        Dry Run
    -j, --jobs       Number of parallel transforms to run  (default 10)
    -v, --version    Displays current version
    -h, --help       Displays this message

  Examples
    $ mocha-to-tap ./**/*.spec.js
```

## License

[MIT](/LICENSE)
