/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports['tests/transform.spec.js > TAP > describe with it > must match snapshot 1'] = `
t.test("test", async t => {
    t.test("another set", async t => {});
});
`

exports['tests/transform.spec.js > TAP > empty describe > must match snapshot 1'] = `
t.test();
`

exports['tests/transform.spec.js > TAP > nested describes with it > must match snapshot 1'] = `
t.test("test", async t => {
    t.test("inner test", async t => {
        t.test("inner inner test", async t => {
            t.test("why even check now", async t => {});
        });
    });
});
`

exports['tests/transform.spec.js > TAP > test import namespace > must match snapshot 1'] = `
import tap from "tap";

t.test("test", async t => {
    t.test("why even check now", async t => {
        t.ok(true);
    });
});
`

exports['tests/transform.spec.js > TAP > test typescript > must match snapshot 1'] = `
import tap from "tap";
import lib from "./lib";

t.test("test", async t => {
    t.test("why even check now", async t => {
        const a: number = 1;
        t.ok(a);
    });
});
`
