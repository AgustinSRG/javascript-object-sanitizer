// Number Test

"use strict";

import { expect } from 'chai';
import { ObjectSchema } from '../src/index';

describe("Number sanitizer testing", () => {

    /* Schema test */

    describe("Schema tester - Checks if the input matches the schema", () => {
        it('Should match only if the input is a number type', () => {
            const schema = ObjectSchema.number().allowInfinite().allowNaN();

            expect(schema.test(0)).to.be.true;
            expect(schema.test(1)).to.be.true;
            expect(schema.test(Math.random())).to.be.true;
            expect(schema.test(Infinity)).to.be.true;
            expect(schema.test(NaN)).to.be.true;

            expect(schema.test(undefined)).to.be.false;
            expect(schema.test(null)).to.be.false;
            expect(schema.test(true)).to.be.false;
            expect(schema.test(false)).to.be.false;
            expect(schema.test("")).to.be.false;
            expect(schema.test("Random String")).to.be.false;
            expect(schema.test(new Date())).to.be.false;
            expect(schema.test([])).to.be.false;
            expect(schema.test(["", "Test String"])).to.be.false;
            expect(schema.test({})).to.be.false;
            expect(schema.test(BigInt(20))).to.be.false;

            expect(schema.provideTestError(undefined)).satisfies((a: Error) => a.message.startsWith("Not number type: "));
            expect(schema.provideTestError(null)).satisfies((a: Error) => a.message.startsWith("Not number type: "));
            expect(schema.provideTestError(true)).satisfies((a: Error) => a.message.startsWith("Not number type: "));
            expect(schema.provideTestError(false)).satisfies((a: Error) => a.message.startsWith("Not number type: "));
            expect(schema.provideTestError("")).satisfies((a: Error) => a.message.startsWith("Not number type: "));
            expect(schema.provideTestError("Random String")).satisfies((a: Error) => a.message.startsWith("Not number type: "));
            expect(schema.provideTestError(new Date())).satisfies((a: Error) => a.message.startsWith("Not number type: "));
            expect(schema.provideTestError([])).satisfies((a: Error) => a.message.startsWith("Not number type: "));
            expect(schema.provideTestError(["", "Test String"])).satisfies((a: Error) => a.message.startsWith("Not number type: "));
            expect(schema.provideTestError({})).satisfies((a: Error) => a.message.startsWith("Not number type: "));
            expect(schema.provideTestError(BigInt(20))).satisfies((a: Error) => a.message.startsWith("Not number type: "));
        });

        it('Shoud reject decimals if interger is forced', () => {
            const schema = ObjectSchema.integer();

            expect(schema.test(0)).to.be.true;
            expect(schema.test(1)).to.be.true;


            expect(schema.test(0.5)).to.be.false;

            expect(schema.provideTestError(0.5)).satisfies((a: Error) => a.message.startsWith("Number has decimal digits, but schema forces integer: "));
        });

        it('Shoud reject NaN if not allowed', () => {
            const schema = ObjectSchema.number();


            expect(schema.test(NaN)).to.be.false;

            expect(schema.provideTestError(NaN)).satisfies((a: Error) => a.message.startsWith("NaN not allowed: "));
        });

        it('Shoud reject Infinity if not allowed', () => {
            const schema = ObjectSchema.number();


            expect(schema.test(Infinity)).to.be.false;

            expect(schema.provideTestError(Infinity)).satisfies((a: Error) => a.message.startsWith("Infinity not allowed: "));
        });

        it('Shoud reject number out of bounds', () => {
            const schema = ObjectSchema.number().withMin(0).withMax(1);

            expect(schema.test(0)).to.be.true;
            expect(schema.test(0.5)).to.be.true;
            expect(schema.test(1)).to.be.true;


            expect(schema.test(2)).to.be.false;

            expect(schema.provideTestError(2)).satisfies((a: Error) => a.message.startsWith("Number is greater than max value set: "));

            expect(schema.test(-1)).to.be.false;

            expect(schema.provideTestError(-1)).satisfies((a: Error) => a.message.startsWith("Number is lower than min value set: "));
        });

        it('Shoud reject numbers that does not match the enumeration set', () => {
            const schema = ObjectSchema.number().withEnumeration([0, 2]);

            expect(schema.test(0)).to.be.true;
            expect(schema.test(2)).to.be.true;

            expect(schema.test(3)).to.be.false;

            expect(schema.provideTestError(3)).satisfies((a: Error) => a.message.startsWith("Number is not in the enumeration: "));
        });
    });

    /* Type parsing */

    describe("Type parsing - Should always return number type", () => {
        it('Should parse string types', () => {
            const schema = ObjectSchema.number().allowInfinite().allowNaN();

            expect(schema.sanitize("0")).to.be.eq(0);
            expect(schema.sanitize("0.1")).to.be.eq(0.1);
            expect(schema.sanitize("")).to.be.eq(0);
        });

        it('Should parse numbers', () => {
            const schema = ObjectSchema.number().allowInfinite().allowNaN();
            const randomNumber = Math.random() * 100;

            expect(schema.sanitize(0)).to.be.equal(0);
            expect(schema.sanitize(1)).to.be.equal(1);
            expect(schema.sanitize(randomNumber)).to.be.equal(randomNumber);
            expect(schema.sanitize(Infinity)).to.be.equal(Infinity);
            expect(schema.sanitize(NaN)).to.be.NaN;
        });

        it('Should parse booleans', () => {
            const schema = ObjectSchema.number().allowInfinite().allowNaN();

            expect(schema.sanitize(true)).to.be.equal(1);
            expect(schema.sanitize(false)).to.be.equal(0);
        });

        it('Should parse dates to UTC timestamp', () => {
            const schema = ObjectSchema.number().allowInfinite().allowNaN();
            const date = new Date();

            expect(schema.sanitize(date)).to.be.equal(date.getTime());
        });

        it('Should parse arrays to NaN', () => {
            const schema = ObjectSchema.number().allowInfinite().allowNaN();
            const array = [1, 2, "a", "b", "c", 3];

            expect(schema.sanitize(array)).to.be.NaN;
        });

        it('Should parse arbitrary objects to NaN', () => {
            const schema = ObjectSchema.number().allowInfinite().allowNaN();

            expect(schema.sanitize({})).to.be.NaN;
        });
    });

    /* Default value testing */

    describe("Default value testing", () => {
        it('Should return default value if undefined or null is given', () => {
            const schema = ObjectSchema.number().allowInfinite().allowNaN();

            expect(schema.sanitize(undefined)).to.be.equal(undefined);
            expect(schema.sanitize(null)).to.be.equal(undefined);

            schema.withDefaultValue(0);

            expect(schema.sanitize(undefined)).to.be.equal(0);
            expect(schema.sanitize(null)).to.be.equal(0);
        });

        it('Should return default value if NaN or Infinity are given, but not allowed', () => {
            const schema = ObjectSchema.number().withDefaultValue(0);

            expect(schema.sanitize(NaN)).to.be.equal(0);
            expect(schema.sanitize(Infinity)).to.be.equal(0);
            expect(schema.sanitize(-Infinity)).to.be.equal(0);
            expect(schema.sanitize({})).to.be.equal(0);
        });
    });

    /* Specific restrictions testing */

    describe("Number restriction testing", () => {
        it('Should truncate numbers if integer is forced', () => {
            const schema = ObjectSchema.integer();

            expect(schema.sanitize(1)).to.be.equal(1);
            expect(schema.sanitize(1.1)).to.be.equal(1);
            expect(schema.sanitize(1.9)).to.be.equal(1);
        });

        it('Should reject NaN if not allowed', () => {
            const schema = ObjectSchema.number();

            expect(schema.sanitize(NaN)).to.be.equal(undefined);
            expect(schema.sanitize(Number({}))).to.be.equal(undefined);
        });

        it('Should reject Infinity if not allowed', () => {
            const schema = ObjectSchema.number();

            expect(schema.sanitize(Infinity)).to.be.equal(undefined);
            expect(schema.sanitize(-Infinity)).to.be.equal(undefined);
        });

        it('Should prevent number from being lower than min value', () => {
            const schema = ObjectSchema.number().withMin(0);

            expect(schema.sanitize(0)).to.be.equal(0);
            expect(schema.sanitize(1)).to.be.equal(1);
            expect(schema.sanitize(-1)).to.be.equal(0);
            expect(schema.sanitize(-0.5)).to.be.equal(0);
        });

        it('Should prevent number from being greater than max value', () => {
            const schema = ObjectSchema.number().withMax(10);

            expect(schema.sanitize(9)).to.be.equal(9);
            expect(schema.sanitize(10)).to.be.equal(10);
            expect(schema.sanitize(11)).to.be.equal(10);
            expect(schema.sanitize(10.5)).to.be.equal(10);
        });

        it('Should reject value if not in the enumeration', () => {
            const schema = ObjectSchema.number().withEnumeration([0, 1, 2]).withDefaultValue(2);

            expect(schema.sanitize(0)).to.be.equal(0);
            expect(schema.sanitize(1)).to.be.equal(1);
            expect(schema.sanitize(2)).to.be.equal(2);
            expect(schema.sanitize(3)).to.be.equal(2);
        });
    });
});
