// Boolean Test

"use strict";

import { expect } from 'chai';
import { ObjectSchema } from '../src/index';

describe("Boolean sanitizer testing", () => {

    /* Schema test */

    describe("Schema tester - Checks if the input matches the schema", () => {
        it('Should match only if the input is a boolean type', () => {
            const schema = ObjectSchema.boolean();

            expect(schema.test(true)).to.be.true;
            expect(schema.test(false)).to.be.true;

            expect(schema.test(undefined)).to.be.false;
            expect(schema.test(null)).to.be.false;
            expect(schema.test(0)).to.be.false;
            expect(schema.test(1)).to.be.false;
            expect(schema.test("")).to.be.false;
            expect(schema.test("Random String")).to.be.false;
            expect(schema.test(new Date())).to.be.false;
            expect(schema.test([])).to.be.false;
            expect(schema.test(["", "Test String"])).to.be.false;
            expect(schema.test({})).to.be.false;
            expect(schema.test(BigInt(20))).to.be.false;

            expect(schema.provideTestError(undefined)).satisfies((a: Error) => a.message.startsWith("Not boolean type: "));
            expect(schema.provideTestError(null)).satisfies((a: Error) => a.message.startsWith("Not boolean type: "));
            expect(schema.provideTestError(0)).satisfies((a: Error) => a.message.startsWith("Not boolean type: "));
            expect(schema.provideTestError(1)).satisfies((a: Error) => a.message.startsWith("Not boolean type: "));
            expect(schema.provideTestError("")).satisfies((a: Error) => a.message.startsWith("Not boolean type: "));
            expect(schema.provideTestError("Random String")).satisfies((a: Error) => a.message.startsWith("Not boolean type: "));
            expect(schema.provideTestError(new Date())).satisfies((a: Error) => a.message.startsWith("Not boolean type: "));
            expect(schema.provideTestError([])).satisfies((a: Error) => a.message.startsWith("Not boolean type: "));
            expect(schema.provideTestError(["", "Test String"])).satisfies((a: Error) => a.message.startsWith("Not boolean type: "));
            expect(schema.provideTestError({})).satisfies((a: Error) => a.message.startsWith("Not boolean type: "));
            expect(schema.provideTestError(BigInt(20))).satisfies((a: Error) => a.message.startsWith("Not boolean type: "));
        });

        it('Shoud reject values not in the enumeration', () => {
            const schema = ObjectSchema.boolean().withEnumeration([true]);

            expect(schema.test(true)).to.be.true;

            expect(schema.test(false)).to.be.false;

            expect(schema.provideTestError(false)).satisfies((a: Error) => a.message.startsWith("Boolean not in the enumeration: "));
        });
    });

    /* Type parsing */

    describe("Type parsing - Should always return boolean type", () => {
        it('Should parse string types', () => {
            const schema = ObjectSchema.boolean();

            expect(schema.sanitize("")).to.be.eq(false);
            expect(schema.sanitize("Random String")).to.be.eq(true);
        });

        it('Should parse numbers', () => {
            const schema = ObjectSchema.boolean();

            expect(schema.sanitize(0)).to.be.equal(false);
            expect(schema.sanitize(1)).to.be.equal(true);
            expect(schema.sanitize(0.5)).to.be.equal(true);
            expect(schema.sanitize(Infinity)).to.be.equal(true);
            expect(schema.sanitize(NaN)).to.be.equal(false);
        });

        it('Should parse booleans', () => {
            const schema = ObjectSchema.boolean();

            expect(schema.sanitize(true)).to.be.equal(true);
            expect(schema.sanitize(false)).to.be.equal(false);
        });

        it('Arbitrary objects', () => {
            const schema = ObjectSchema.boolean();

            expect(schema.sanitize(new Date())).to.be.equal(true);
            expect(schema.sanitize([])).to.be.equal(true);
            expect(schema.sanitize({})).to.be.equal(true);
        });
    });

    /* Default value testing */

    describe("Default value testing", () => {
        it('Should return default value if undefined or null is given', () => {
            const schema = ObjectSchema.boolean();

            expect(schema.sanitize(undefined)).to.be.equal(undefined);
            expect(schema.sanitize(null)).to.be.equal(undefined);

            schema.withDefaultValue(false);

            expect(schema.sanitize(undefined)).to.be.equal(false);
            expect(schema.sanitize(null)).to.be.equal(false);

            schema.withDefaultValue(true);

            expect(schema.sanitize(undefined)).to.be.equal(true);
            expect(schema.sanitize(null)).to.be.equal(true);
        });
    });

    /* Specific restrictions testing */

    describe("Boolean restriction testing", () => {
        it('Should reject value if not in the enumeration', () => {
            const schema = ObjectSchema.boolean().withEnumeration([true]).withDefaultValue(true);

            expect(schema.sanitize(true)).to.be.equal(true);
            expect(schema.sanitize(false)).to.be.equal(true);
        });
    });
});
