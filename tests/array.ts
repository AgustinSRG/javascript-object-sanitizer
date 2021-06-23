// Array Test

"use strict";

import { expect } from 'chai';
import { ObjectSchema } from '../src/index';

describe("Array sanitizer testing", () => {

    /* Schema test */

    describe("Schema tester - Checks if the input matches the schema", () => {
        it('Should match only if the input is an Array', () => {
            const schema = ObjectSchema.array(ObjectSchema.custom());

            expect(schema.test([])).to.be.true;
            expect(schema.test([1, 2, 3])).to.be.true;

            expect(schema.test(undefined)).to.be.false;
            expect(schema.test(null)).to.be.false;
            expect(schema.test(0)).to.be.false;
            expect(schema.test(1)).to.be.false;
            expect(schema.test("")).to.be.false;
            expect(schema.test("Random String")).to.be.false;
            expect(schema.test(new Date())).to.be.false;
            expect(schema.test(true)).to.be.false;
            expect(schema.test(false)).to.be.false;
            expect(schema.test({})).to.be.false;
            expect(schema.test(BigInt(20))).to.be.false;

            expect(schema.provideTestError(undefined)).satisfies((a: Error) => a.message.startsWith("Not an array: "));
            expect(schema.provideTestError(null)).satisfies((a: Error) => a.message.startsWith("Not an array: "));
            expect(schema.provideTestError(0)).satisfies((a: Error) => a.message.startsWith("Not an array: "));
            expect(schema.provideTestError(1)).satisfies((a: Error) => a.message.startsWith("Not an array: "));
            expect(schema.provideTestError("")).satisfies((a: Error) => a.message.startsWith("Not an array: "));
            expect(schema.provideTestError("Random String")).satisfies((a: Error) => a.message.startsWith("Not an array: "));
            expect(schema.provideTestError(new Date())).satisfies((a: Error) => a.message.startsWith("Not an array: "));
            expect(schema.provideTestError(true)).satisfies((a: Error) => a.message.startsWith("Not an array: "));
            expect(schema.provideTestError(false)).satisfies((a: Error) => a.message.startsWith("Not an array: "));
            expect(schema.provideTestError({})).satisfies((a: Error) => a.message.startsWith("Not an array: "));
            expect(schema.provideTestError(BigInt(20))).satisfies((a: Error) => a.message.startsWith("Not an array: "));
        });

        it('Shoud reject arrays with more items than allowed', () => {
            const schema = ObjectSchema.array(ObjectSchema.custom()).withMaxLength(3);

            expect(schema.test([])).to.be.true;
            expect(schema.test([1])).to.be.true;
            expect(schema.test([1, 2, 3])).to.be.true;

            expect(schema.test([1, 2, 3, 4])).to.be.false;

            expect(schema.provideTestError([1, 2, 3, 4])).satisfies((a: Error) => a.message.startsWith("Too many items: "));
        });

        it('Shoud reject arrays with items that does not match the items schema', () => {
            const schema = ObjectSchema.array(ObjectSchema.string());

            expect(schema.test([])).to.be.true;
            expect(schema.test(["a", "b", "c"])).to.be.true;

            expect(schema.test([1, 2, 3, 4])).to.be.false;
            expect(schema.test(["a", "b", 1])).to.be.false;

            expect(schema.provideTestError([1, 2, 3, 4])).satisfies((a: Error) => a.message.startsWith("[Array] For item ["));
            expect(schema.provideTestError(["a", "b", 1])).satisfies((a: Error) => a.message.startsWith("[Array] For item ["));
        });
    });

    /* Default value testing */

    describe("Default value testing", () => {
        it('Should return default value if undefined or null is given', () => {
            const schema = ObjectSchema.array(ObjectSchema.custom());

            expect(schema.sanitize(undefined)).to.be.equal(undefined);
            expect(schema.sanitize(null)).to.be.equal(undefined);

            schema.withDefaultValue([]);

            expect(schema.sanitize(undefined)).to.be.eql([]);
            expect(schema.sanitize(null)).to.be.eql([]);

            schema.withDefaultValue([1, 2, 3]);

            expect(schema.sanitize(undefined)).to.be.eql([1, 2, 3]);
            expect(schema.sanitize(null)).to.be.eql([1, 2, 3]);
        });

        it('Should return default value anything different from an array is given', () => {
            const schema = ObjectSchema.array(ObjectSchema.custom()).withDefaultValue([]);


            expect(schema.sanitize(undefined)).to.be.eql([]);
            expect(schema.sanitize(null)).to.be.eql([]);
            expect(schema.sanitize(0)).to.be.eql([]);
            expect(schema.sanitize(1)).to.be.eql([]);
            expect(schema.sanitize(NaN)).to.be.eql([]);
            expect(schema.sanitize(true)).to.be.eql([]);
            expect(schema.sanitize(false)).to.be.eql([]);
            expect(schema.sanitize("")).to.be.eql([]);
            expect(schema.sanitize("Random string")).to.be.eql([]);
            expect(schema.sanitize(new Date())).to.be.eql([]);
            expect(schema.sanitize({})).to.be.eql([]);
            expect(schema.sanitize({length: 3})).to.be.eql([]);
        });
    });

    /* Specific restrictions testing */

    describe("Array restriction testing", () => {
        it('Should apply the items schema to items in the array', () => {
            const schema = ObjectSchema.array(ObjectSchema.string().withEnumeration(["a", "b", "c"]))

            expect(schema.sanitize([])).to.be.eql([]);
            expect(schema.sanitize([0, 1, 2])).to.be.eql([]);
            expect(schema.sanitize(["a"])).to.be.eql(["a"]);
            expect(schema.sanitize(["a", "b"])).to.be.eql(["a", "b"]);
            expect(schema.sanitize(["a", "b", "f", "c", "g"])).to.be.eql(["a", "b", "c"]);
            expect(schema.sanitize([true, "a", -1, new Date()])).to.be.eql(["a"]);
        });
    });
});
