const { equal, isFalse, isTrue } = require("chai").assert

import { dateFromString, isFalsy, isTruthy, plusTime } from "../internals"


describe("truthy and falsy", () => {

    it("truthy", () => {
        isFalse(isTruthy(undefined))
        isFalse(isTruthy(null))
        isFalse(isTruthy(false))
        isTrue(isTruthy(true))
        isFalse(isTruthy([]), "empty array")
        isTrue(isTruthy([ "foo" ]), "non-empty array")
        isFalse(isTruthy({}), "empty object")
        isTrue(isTruthy({ foo: "bar" }), "non-empty object")
        isTrue(isTruthy("foo"))
        isFalse(isTruthy(""))
        isTrue(isTruthy(42))
        isFalse(isTruthy(0))
    })

    it("falsy", () => {
        isFalse(isFalsy(undefined))
        isTrue(isFalsy(null))
        isTrue(isFalsy(false))
        isFalse(isFalsy(true))
        isTrue(isFalsy([]), "empty array")
        isFalse(isFalsy([ "foo" ]), "non-empty array")
        isTrue(isFalsy({}), "empty object")
        isFalse(isFalsy({ foo: "bar" }), "non-empty object")
        isFalse(isFalsy("foo"))
        isTrue(isFalsy(""))
        isFalse(isFalsy(42))
        isTrue(isFalsy(0))
    })

})


describe("parsing of dates/date-times", () => {

    const check = (dateTimeLike: string, expected: String) =>
        equal(dateFromString(dateTimeLike).toISOString(), expected)

    it("construct a date from a string without time information (compliant with a JSON Schema \"date\" formatted string)", () => {
        check("2021-05-04", "2021-05-04T00:00:00.000Z")
        check("2021-05-04", "2021-05-04T00:00:00.000Z")
    })

    it("construct date-times from strings in RFC 3339 format (compliant with a JSON Schema \"date-time\" formatted string)", () => {
        check("2021-05-04T13:37:42Z", "2021-05-04T13:37:42.000Z")
        check("2021-05-04T13:37:42+00:00", "2021-05-04T13:37:42.000Z")
        check("2021-05-04T13:37:42-00:00", "2021-05-04T13:37:42.000Z")
        check("2021-08-20T12:03:12+02:00", "2021-08-20T10:03:12.000Z")   // (keeps timezone offset)
    })

    it("construct date-times from strings in non-RFC 3339 but ISO 8601 formats", () => {
        check("2021-08-20T12:03:12+02", "2021-08-20T10:03:12.000Z")
        check("2021-05-04T13:37:42+0000", "2021-05-04T13:37:42.000Z")
        check("2021-05-04T13:37:42-0000", "2021-05-04T13:37:42.000Z")
        check("2021-08-20T12:03:12+0200", "2021-08-20T10:03:12.000Z")
    })

    it("construct date-times from strings which also have millisecond info", () => {
        check("2021-08-01T00:00:00.1Z", "2021-08-01T00:00:00.100Z")       // 100 ms
        check("2021-08-01T00:00:00.01Z", "2021-08-01T00:00:00.010Z")      //  10 ms
        check("2021-08-01T00:00:00.001Z", "2021-08-01T00:00:00.001Z")     //   1 ms
        check("2021-08-01T00:00:00.0001Z", "2021-08-01T00:00:00.000Z")    // 100 µs
        check("2021-08-01T00:00:00.00001Z", "2021-08-01T00:00:00.000Z")   //  10 µs
        check("2021-08-01T00:00:00.000001Z", "2021-08-01T00:00:00.000Z")  //   1 µs
    })

})


describe("plusTime", () => {

    it("works for 1-day offsets", () => {
        equal(plusTime("2021-06-23", 1, "day").toISOString(), "2021-06-24T00:00:00.000Z")
        equal(plusTime("2021-06-23", -1, "day").toISOString(), "2021-06-22T00:00:00.000Z")
    })

    it("works for 1-hour offsets", () => {
        equal(plusTime("2021-06-23T00:00:00.000Z", 1, "hour").toISOString(), "2021-06-23T01:00:00.000Z")
        equal(plusTime("2021-06-23T00:00:00.000Z", -1, "hour").toISOString(), "2021-06-22T23:00:00.000Z")
    })

    it("works for day-offsets in hours", () => {
        equal(plusTime("2021-06-23T00:00:00.000Z", 24, "hour").toISOString(), "2021-06-24T00:00:00.000Z")
        equal(plusTime("2021-06-23T00:00:00.000Z", 48, "hour").toISOString(), "2021-06-25T00:00:00.000Z")
        equal(plusTime("2021-06-23T00:00:00.000Z", 72, "hour").toISOString(), "2021-06-26T00:00:00.000Z")
        equal(plusTime("2021-06-23T00:00:00.000Z", -24, "hour").toISOString(), "2021-06-22T00:00:00.000Z")
        equal(plusTime("2021-06-23T00:00:00.000Z", -48, "hour").toISOString(), "2021-06-21T00:00:00.000Z")
        equal(plusTime("2021-06-23T00:00:00.000Z", -72, "hour").toISOString(), "2021-06-20T00:00:00.000Z")
    })

    it("not affected by DST transitions", () => {
        equal(plusTime("2021-06-23", -180, "day").toISOString(), "2020-12-25T00:00:00.000Z")
    })

    // The assertions with even index coincide with the assertions of the test case "comparisons of date-times constructed using plusTime across DST transitions" in `date-times.json` in the test suite:
    it("yields comparable values", () => {
        isFalse(plusTime("2020-12-24", 0, "day") >= plusTime("2021-06-23T00:00:00Z", -180, "day"), "d1 more than 180 days before d2")
        isFalse(plusTime("2020-12-24", 180, "day") >= plusTime("2021-06-23T00:00:00Z", 0, "day"), "d1 more than 180 days before d2")
        isTrue(plusTime("2020-12-25", 0, "day") >= plusTime("2021-06-23T00:00:00Z", -180, "day"), "d1 exactly 180 days before d2")
        isTrue(plusTime("2020-12-25", 180, "day") >= plusTime("2021-06-23T00:00:00Z", 0, "day"), "d1 exactly 180 days before d2")
        isTrue(plusTime("2020-12-26", 0, "day") >= plusTime("2021-06-23T00:00:00Z", -180, "day"), "d1 less than 180 days before d2")
        isTrue(plusTime("2020-12-26", 180, "day") >= plusTime("2021-06-23T00:00:00Z", 0, "day"), "d1 less than 180 days before d2")
    })

})

