import t from 'tap'
import { transform } from '../lib/transform.js'

t.test('empty describe', (t) => {
  const code = `
  describe()
`
  t.matchSnapshot(transform(code))
  t.end()
})

t.test('describe with it', (t) => {
  const code = `
    describe("test",()=>{
        it("another set", ()=> {

        })
    })
  `
  t.matchSnapshot(transform(code))
  t.end()
})

t.test('nested describes with it', (t) => {
  const code = `
      describe("test",()=>{
        describe("inner test",()=>{
            describe("inner inner test",()=>{
                it("why even check now", ()=> {
                })
            })
        })
      })
    `
  t.matchSnapshot(transform(code))
  t.end()
})

t.test('test import namespace', (t) => {
  const code = `
        import tap from "tap"
        describe("test",()=>{
                  it("why even check now", ()=> {
                        tap.ok(true)
                  })
        })
      `
  t.matchSnapshot(transform(code))
  t.end()
})

t.test('test typescript', (t) => {
  const code = `
          import tap from "tap"
          import lib from "./lib"

          describe("test",()=>{
                    it("why even check now", ()=> {
                        const a:number = 1
                        tap.ok(a)
                    })
          })
        `
  t.matchSnapshot(transform(code, { typescript: true }))
  t.end()
})
