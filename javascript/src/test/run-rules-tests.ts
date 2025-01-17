const { deepEqual, fail } = require("chai").assert
import { existsSync, readdirSync } from "fs"
import { join } from "path"

import { readJson } from "../file-utils"
import { rulesetsPath } from "../paths"
import { Rule, RuleRunner, euTemplateRuleset } from "../rules"


interface Assertion {
    name?: string
    payload: any
    validationClock?: string
    expected: any
    message?: string
}


const runTests = (rule: Rule, assertions: Assertion[], runRule: RuleRunner) => {
    describe(`rule: "${rule.id}"`, () => {
        assertions.forEach(({ name, payload, validationClock, expected, message }, index) => {
            const assertionText = `assertion ${index + 1}`
            it(name ? `${name} (${assertionText})` : assertionText, () => {
                deepEqual(runRule(rule, payload, validationClock), expected)
            })
        })
    })
}


export const runTestsWith = (runRule: RuleRunner) => {
    const rulesTestsPath = join(rulesetsPath, "EU/tests");
    euTemplateRuleset.forEach((rule) => {
        const ruleAssertionsFile = join(rulesTestsPath, `${rule.id}.json`)
        if (existsSync(ruleAssertionsFile)) {
            runTests(rule, readJson(ruleAssertionsFile), runRule)
        } else {
            describe(`rule: "${rule.id}"`, () => {
                it(`no assertions file`, () => {
                    fail()
                })
            })
        }
    })

    const assertionsFilesForNonExistingRules = readdirSync(rulesTestsPath)
        .filter((path) => path.endsWith(".json"))
        .map((path) => path.substring(path.lastIndexOf("/") + 1, path.length - ".json".length))
        .filter((ruleId) => !euTemplateRuleset.find((rule) => rule.id === ruleId))
    if (assertionsFilesForNonExistingRules.length === 0) {
        console.log(`no assertions files for non-existing rules`)
    } else {
        console.log(`JSON files (apparently) for non-existing rules found: rule IDs would be ${assertionsFilesForNonExistingRules.map((ruleId) => `'${ruleId}'`).join(", ")}`)
    }
}

