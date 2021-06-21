// String Test

"use strict";

import { expect } from 'chai';
import { ObjectSchema } from '../src/index';

describe("String sanitizer testing", () => {

    /* Schema test */

    describe("Schema tester - Checks if the input matches the schema", () => {
        it('Should match only if the input is a string type', () => {
            const schema = ObjectSchema.string();

            expect(schema.test("Test string")).to.be.true;
            expect(schema.test("")).to.be.true;

            expect(schema.test(undefined)).to.be.false;
            expect(schema.test(null)).to.be.false;
            expect(schema.test(true)).to.be.false;
            expect(schema.test(false)).to.be.false;
            expect(schema.test(0)).to.be.false;
            expect(schema.test(1)).to.be.false;
            expect(schema.test(Math.random())).to.be.false;
            expect(schema.test(new Date())).to.be.false;
            expect(schema.test([])).to.be.false;
            expect(schema.test(["", "Test String"])).to.be.false;
            expect(schema.test({})).to.be.false;
            expect(schema.test(BigInt(20))).to.be.false;

            expect(schema.provideTestError(undefined)).satisfies((a: Error) => a.message.startsWith("Not string type: "));
            expect(schema.provideTestError(null)).satisfies((a: Error) => a.message.startsWith("Not string type: "));
            expect(schema.provideTestError(true)).satisfies((a: Error) => a.message.startsWith("Not string type: "));
            expect(schema.provideTestError(false)).satisfies((a: Error) => a.message.startsWith("Not string type: "));
            expect(schema.provideTestError(0)).satisfies((a: Error) => a.message.startsWith("Not string type: "));
            expect(schema.provideTestError(1)).satisfies((a: Error) => a.message.startsWith("Not string type: "));
            expect(schema.provideTestError(Math.random())).satisfies((a: Error) => a.message.startsWith("Not string type: "));
            expect(schema.provideTestError(new Date())).satisfies((a: Error) => a.message.startsWith("Not string type: "));
            expect(schema.provideTestError([])).satisfies((a: Error) => a.message.startsWith("Not string type: "));
            expect(schema.provideTestError(["", "Test String"])).satisfies((a: Error) => a.message.startsWith("Not string type: "));
            expect(schema.provideTestError({})).satisfies((a: Error) => a.message.startsWith("Not string type: "));
            expect(schema.provideTestError(BigInt(20))).satisfies((a: Error) => a.message.startsWith("Not string type: "));
        });

        it('Should reject string that does not match the regular expression set', () => {
            const schema = ObjectSchema.string().withRegularExpression(/^test\sstring\s[0-1]+/i);

            expect(schema.test("Test string 1")).to.be.true;
            expect(schema.test("Test string 123")).to.be.true;

            expect(schema.test("")).to.be.false;
            expect(schema.test("Test string")).to.be.false;
            expect(schema.test("Random string")).to.be.false;

            expect(schema.provideTestError("")).satisfies((a: Error) => a.message.startsWith("String does not match regular expession: "));
            expect(schema.provideTestError("Test string")).satisfies((a: Error) => a.message.startsWith("String does not match regular expession: "));
            expect(schema.provideTestError("Random string")).satisfies((a: Error) => a.message.startsWith("String does not match regular expession: "));
        });

        it('Should reject string that does not match the enumeration set', () => {
            const schema = ObjectSchema.string().withEnumeration(["a", "b", "c"]);

            expect(schema.test("a")).to.be.true;
            expect(schema.test("b")).to.be.true;
            expect(schema.test("c")).to.be.true;

            expect(schema.test("")).to.be.false;
            expect(schema.test("d")).to.be.false;
            expect(schema.test("Random string")).to.be.false;

            expect(schema.provideTestError("")).satisfies((a: Error) => a.message.startsWith("String is not in the enumeration: "));
            expect(schema.provideTestError("d")).satisfies((a: Error) => a.message.startsWith("String is not in the enumeration: "));
            expect(schema.provideTestError("Random string")).satisfies((a: Error) => a.message.startsWith("String is not in the enumeration: "));
        });

        it('Should reject string larger than max length set', () => {
            const schema = ObjectSchema.string().withMaxLength(2);

            expect(schema.test("")).to.be.true;
            expect(schema.test("a")).to.be.true;
            expect(schema.test("ab")).to.be.true;

            expect(schema.test("abc")).to.be.false;
            expect(schema.test("Random string")).to.be.false;

            expect(schema.provideTestError("abc")).satisfies((a: Error) => a.message.startsWith("String exceeds max length: "));
            expect(schema.provideTestError("Random string")).satisfies((a: Error) => a.message.startsWith("String exceeds max length: "));
        });
    });

    /* Type parsing */

    describe("Type parsing - Should always return string type", () => {
        it('Should parse string types', () => {
            const schema = ObjectSchema.string();

            expect(schema.sanitize("Test String")).to.be.eq("Test String");
        });

        it('Should parse numbers', () => {
            const schema = ObjectSchema.string();
            const randomNumber = Math.random() * 100;

            expect(schema.sanitize(randomNumber)).to.be.equal("" + randomNumber);
        });

        it('Should parse booleans', () => {
            const schema = ObjectSchema.string();

            expect(schema.sanitize(true)).to.be.equal("true");
            expect(schema.sanitize(false)).to.be.equal("false");
        });

        it('Should parse dates', () => {
            const schema = ObjectSchema.string();
            const date = new Date();

            expect(schema.sanitize(date)).to.be.equal(date.toISOString());
        });

        it('Should parse arrays', () => {
            const schema = ObjectSchema.string();
            const array = [1, 2, "a", "b", "c", 3];

            expect(schema.sanitize(array)).to.be.equal(array.join());
        });
    });



    /* Default value testing */

    describe("Default value testing", () => {
        it('Should return default value if undefined or null is given', () => {
            const schema = ObjectSchema.string();

            expect(schema.sanitize(undefined)).to.be.equal(undefined);
            expect(schema.sanitize(null)).to.be.equal(undefined);

            schema.withDefaultValue("");

            expect(schema.sanitize(undefined)).to.be.equal("");
            expect(schema.sanitize(null)).to.be.equal("");
        });

        it('Should return default value if arbitrary object is given', () => {
            const schema = ObjectSchema.string();

            expect(schema.sanitize({})).to.be.equal(undefined);

            schema.withDefaultValue("");

            expect(schema.sanitize({})).to.be.equal("");
        });
    });

    /* Specific restrictions testing */

    describe("String restriction testing", () => {
        it('Should truncate strings larger than max length', () => {
            const schema = ObjectSchema.string().withMaxLength(2);

            expect(schema.sanitize("")).to.be.equal("");
            expect(schema.sanitize("a")).to.be.equal("a");
            expect(schema.sanitize("ab")).to.be.equal("ab");
            expect(schema.sanitize("abc")).to.be.equal("ab");
            expect(schema.sanitize("abcdefg")).to.be.equal("ab");
        });

        it('Should return default value if input does not match regular expression', () => {
            const schema = ObjectSchema.string().withRegularExpression(/^test\sstring\s[0-1]+/i).withDefaultValue("");

            expect(schema.sanitize("Test string 1")).to.be.equal("Test string 1");
            expect(schema.sanitize("Random String")).to.be.equal("");
        });

        it('Should return default value if input does not match enumeration', () => {
            const schema = ObjectSchema.string().withEnumeration(["a", "b"]).withDefaultValue("b");

            expect(schema.sanitize("a")).to.be.equal("a");
            expect(schema.sanitize("b")).to.be.equal("b");
            expect(schema.sanitize("c")).to.be.equal("b");
        });
    });
});
