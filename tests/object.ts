// Object Test

"use strict";

import { expect } from 'chai';
import { ObjectSchema } from '../src/index';

describe("Object sanitizer testing", () => {

    /* Schema test */

    describe("Schema tester - Checks if the input matches the schema", () => {
        it('Should match only if the input is an Object', () => {
            const schema = ObjectSchema.create();

            expect(schema.test([])).to.be.true;
            expect(schema.test([1, 2, 3])).to.be.true;
            expect(schema.test({})).to.be.true;
            expect(schema.test({ test: 1 })).to.be.true;
            expect(schema.test(new Date())).to.be.true;

            expect(schema.test(undefined)).to.be.false;
            expect(schema.test(null)).to.be.false;
            expect(schema.test(0)).to.be.false;
            expect(schema.test(1)).to.be.false;
            expect(schema.test("")).to.be.false;
            expect(schema.test("Random String")).to.be.false;
            expect(schema.test(true)).to.be.false;
            expect(schema.test(false)).to.be.false;
            expect(schema.test(BigInt(20))).to.be.false;

            expect(schema.provideTestError(undefined)).satisfies((a: Error) => a.message.startsWith("Not an object: "));
            expect(schema.provideTestError(null)).satisfies((a: Error) => a.message.startsWith("Not an object: "));
            expect(schema.provideTestError(0)).satisfies((a: Error) => a.message.startsWith("Not an object: "));
            expect(schema.provideTestError(1)).satisfies((a: Error) => a.message.startsWith("Not an object: "));
            expect(schema.provideTestError("")).satisfies((a: Error) => a.message.startsWith("Not an object: "));
            expect(schema.provideTestError("Random String")).satisfies((a: Error) => a.message.startsWith("Not an object: "));
            expect(schema.provideTestError(true)).satisfies((a: Error) => a.message.startsWith("Not an object: "));
            expect(schema.provideTestError(false)).satisfies((a: Error) => a.message.startsWith("Not an object: "));
            expect(schema.provideTestError(BigInt(20))).satisfies((a: Error) => a.message.startsWith("Not an object: "));
        });

        it('Shoud reject objects with missing or invalid required properties', () => {
            const schema = ObjectSchema.create()
                .withProperty("req", ObjectSchema.string());

            expect(schema.test({ req: "test" })).to.be.true;
            expect(schema.test({ req: "" })).to.be.true;

            expect(schema.test([1, 2, 3, 4])).to.be.false;
            expect(schema.test({})).to.be.false;
            expect(schema.test({ "notreq": "test" })).to.be.false;
            expect(schema.test({ "req": true })).to.be.false;
        });

        it('Shoud reject objets with keys not allowed by the filter', () => {
            const schema = ObjectSchema.create()
                .withPropertyFilter(prop => {
                    return (/^prop[0-9]+$/).test(prop);
                }, a => ObjectSchema.integer());

            expect(schema.test({})).to.be.true;
            expect(schema.test({ "prop1": 2 })).to.be.true;

            expect(schema.test({ "random": 1 })).to.be.false;
            expect(schema.test({ "prop1": 2, "random": 1 })).to.be.false;
            expect(schema.test({ "prop1": true })).to.be.false;
        });
    });

    /* Default value testing */

    describe("Default value testing", () => {
        it('Should return default value if undefined or null is given', () => {
            const schema = ObjectSchema.create();

            expect(schema.sanitize(undefined)).to.be.equal(undefined);
            expect(schema.sanitize(null)).to.be.equal(undefined);

            schema.withDefaultValue({});

            expect(schema.sanitize(undefined)).to.be.eql({});
            expect(schema.sanitize(null)).to.be.eql({});

            schema.withDefaultValue({ a: 1 });

            expect(schema.sanitize(undefined)).to.be.eql({ a: 1 });
            expect(schema.sanitize(null)).to.be.eql({ a: 1 });
        });

        it('Should return default value anything different from an object is given', () => {
            const schema = ObjectSchema.create().withDefaultValue({});

            expect(schema.sanitize(undefined)).to.be.eql({});
            expect(schema.sanitize(null)).to.be.eql({});
            expect(schema.sanitize(0)).to.be.eql({});
            expect(schema.sanitize(1)).to.be.eql({});
            expect(schema.sanitize(NaN)).to.be.eql({});
            expect(schema.sanitize(true)).to.be.eql({});
            expect(schema.sanitize(false)).to.be.eql({});
            expect(schema.sanitize("")).to.be.eql({});
            expect(schema.sanitize("Random string")).to.be.eql({});
        });
    });

    /* Specific restrictions testing */

    describe("Object restriction testing", () => {
        it('Should ignore any arbitrary properties', () => {
            const schema = ObjectSchema.object({
                req: ObjectSchema.string().withDefaultValue(""),
                req2: ObjectSchema.integer().withDefaultValue(0),
            });

            expect(schema.sanitize({})).to.be.eql({ req: "", req2: 0 });
            expect(schema.sanitize({ req: 1, req2: "a" })).to.be.eql({ req: "1", req2: 0 });
            expect(schema.sanitize({ req: "a" })).to.be.eql({ req: "a", req2: 0 });
            expect(schema.sanitize({ req: "a", req2: 1, req3: "c" })).to.be.eql({ req: "a", req2: 1 });
        });

        it('Should ignore properties not accepted by the filter', () => {
            const schema = ObjectSchema.dict(
                prop => {
                    return (/^prop[0-9]+$/).test(prop);
                },
                () =>
                    ObjectSchema.string().withDefaultValue("")
            )

            expect(schema.sanitize({})).to.be.eql({});
            expect(schema.sanitize({ prop1: "a", prop2: "b" })).to.be.eql({ prop1: "a", prop2: "b" });
            expect(schema.sanitize({ prop1: "a", random: "b" })).to.be.eql({ prop1: "a" });
            expect(schema.sanitize({ prop1: "a", prop2: 1 })).to.be.eql({ prop1: "a", prop2: "1" });
            expect(schema.sanitize({ prop1: "a", prop2: null })).to.be.eql({ prop1: "a", prop2: "" });
        });
    });
});
