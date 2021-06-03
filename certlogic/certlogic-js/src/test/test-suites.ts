import { PathLike, readdirSync, readFileSync } from "fs"
import { join } from "path"
import { CertLogicExpression, evaluate } from "../certlogic"

const { deepEqual } = require("chai").assert


type TestDirective = "skip" | "only" | undefined

interface Assertion {
    data: any
    expected: any
    directive: TestDirective
    message?: string
}
interface TestCase {
    name: string
    directive: TestDirective
    certLogicExpression: CertLogicExpression
    assertions: Assertion[]
}
interface TestSuite {
    name: string
    directive: TestDirective
    cases: TestCase[]
}


const testDirective2MochaFunc = (testDirective: TestDirective, mochaFunc: any) => testDirective === undefined ? mochaFunc : mochaFunc[testDirective]

const runTestsOn = (testSuite: TestSuite) => {
    testDirective2MochaFunc(testSuite.directive, describe)(testSuite.name, () => {
        testSuite.cases
            .forEach(({name, certLogicExpression, assertions, directive}) => {
                testDirective2MochaFunc(directive, it)(name, () => {
                    assertions
                        .forEach(({ data, expected, message , directive}, index) => {
                            switch (directive) {
                                case "skip": {
                                    console.warn(`      (! skipped assertion ${message || `#${index + 1}`} of:)`)
                                    return
                                }
                                case "only": {
                                    console.warn("(test directive 'only' not supported on assertions)")
                                }
                            }
                            deepEqual(evaluate(certLogicExpression, data), expected, message || JSON.stringify(data))
                        })
                })
            })
    })
}


const testSuitesPath = join(__dirname, "../../../certlogic-overall/testing")

const readJson = (path: PathLike): any => JSON.parse(readFileSync(path, "utf8"))

readdirSync(testSuitesPath)
    .filter((path) => path.endsWith(".json"))
    .forEach((path) => runTestsOn(readJson(join(testSuitesPath, path))))
