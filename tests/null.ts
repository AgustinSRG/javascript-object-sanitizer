// Tests for null and undefined

"use strict";

import { expect } from 'chai';
import { ObjectSchema } from '../src/index';

describe("Null and undefined schemas testing", () => {
    it('Should only accept undefined is schema is undefined', () => {
        const schema = ObjectSchema.undefined();

        expect(schema.test(undefined)).to.be.true;

        expect(schema.test(null)).to.be.false;
        expect(schema.test(true)).to.be.false;
        expect(schema.test(false)).to.be.false;
        expect(schema.test("")).to.be.false;
        expect(schema.test("Random String")).to.be.false;
        expect(schema.test(0)).to.be.false;
        expect(schema.test(NaN)).to.be.false;
        expect(schema.test(new Date())).to.be.false;
        expect(schema.test([])).to.be.false;
        expect(schema.test(["", "Test String"])).to.be.false;
        expect(schema.test({})).to.be.false;
        expect(schema.test(BigInt(20))).to.be.false;

        expect(schema.provideTestError(null)).satisfies((a: Error) => a.message.startsWith("Object not undefined: "));
        expect(schema.provideTestError(true)).satisfies((a: Error) => a.message.startsWith("Object not undefined: "));
        expect(schema.provideTestError(false)).satisfies((a: Error) => a.message.startsWith("Object not undefined: "));
        expect(schema.provideTestError("")).satisfies((a: Error) => a.message.startsWith("Object not undefined: "));
        expect(schema.provideTestError("Random String")).satisfies((a: Error) => a.message.startsWith("Object not undefined: "));
        expect(schema.provideTestError(0)).satisfies((a: Error) => a.message.startsWith("Object not undefined: "));
        expect(schema.provideTestError(NaN)).satisfies((a: Error) => a.message.startsWith("Object not undefined: "));
        expect(schema.provideTestError(new Date())).satisfies((a: Error) => a.message.startsWith("Object not undefined: "));
        expect(schema.provideTestError([])).satisfies((a: Error) => a.message.startsWith("Object not undefined: "));
        expect(schema.provideTestError(["", "Test String"])).satisfies((a: Error) => a.message.startsWith("Object not undefined: "));
        expect(schema.provideTestError({})).satisfies((a: Error) => a.message.startsWith("Object not undefined: "));
        expect(schema.provideTestError(BigInt(20))).satisfies((a: Error) => a.message.startsWith("Object not undefined: "));
    });

    it('Should only accept null is schema is null', () => {
        const schema = ObjectSchema.null();

        expect(schema.test(null)).to.be.true;

        expect(schema.test(undefined)).to.be.false;
        expect(schema.test(true)).to.be.false;
        expect(schema.test(false)).to.be.false;
        expect(schema.test("")).to.be.false;
        expect(schema.test("Random String")).to.be.false;
        expect(schema.test(0)).to.be.false;
        expect(schema.test(NaN)).to.be.false;
        expect(schema.test(new Date())).to.be.false;
        expect(schema.test([])).to.be.false;
        expect(schema.test(["", "Test String"])).to.be.false;
        expect(schema.test({})).to.be.false;
        expect(schema.test(BigInt(20))).to.be.false;

        expect(schema.provideTestError(undefined)).satisfies((a: Error) => a.message.startsWith("Object not null: "));
        expect(schema.provideTestError(true)).satisfies((a: Error) => a.message.startsWith("Object not null: "));
        expect(schema.provideTestError(false)).satisfies((a: Error) => a.message.startsWith("Object not null: "));
        expect(schema.provideTestError("")).satisfies((a: Error) => a.message.startsWith("Object not null: "));
        expect(schema.provideTestError("Random String")).satisfies((a: Error) => a.message.startsWith("Object not null: "));
        expect(schema.provideTestError(0)).satisfies((a: Error) => a.message.startsWith("Object not null: "));
        expect(schema.provideTestError(NaN)).satisfies((a: Error) => a.message.startsWith("Object not null: "));
        expect(schema.provideTestError(new Date())).satisfies((a: Error) => a.message.startsWith("Object not null: "));
        expect(schema.provideTestError([])).satisfies((a: Error) => a.message.startsWith("Object not null: "));
        expect(schema.provideTestError(["", "Test String"])).satisfies((a: Error) => a.message.startsWith("Object not null: "));
        expect(schema.provideTestError({})).satisfies((a: Error) => a.message.startsWith("Object not null: "));
        expect(schema.provideTestError(BigInt(20))).satisfies((a: Error) => a.message.startsWith("Object not null: "));
    });

    it('Should always return undefined if schema is undefined', () => {
        const schema = ObjectSchema.undefined();

        expect(schema.sanitize(undefined)).to.be.equal(undefined);
        expect(schema.sanitize(null)).to.be.equal(undefined);
        expect(schema.sanitize(true)).to.be.equal(undefined);
        expect(schema.sanitize(false)).to.be.equal(undefined);
        expect(schema.sanitize("")).to.be.equal(undefined);
        expect(schema.sanitize("Random String")).to.be.equal(undefined);
        expect(schema.sanitize(0)).to.be.equal(undefined);
        expect(schema.sanitize(NaN)).to.be.equal(undefined);
        expect(schema.sanitize(new Date())).to.be.equal(undefined);
        expect(schema.sanitize([])).to.be.equal(undefined);
        expect(schema.sanitize(["", "Test String"])).to.be.equal(undefined);
        expect(schema.sanitize({})).to.be.equal(undefined);
        expect(schema.sanitize(BigInt(20))).to.be.equal(undefined);
    });

    it('Should always return null if schema is null', () => {
        const schema = ObjectSchema.null();

        expect(schema.sanitize(undefined)).to.be.equal(null);
        expect(schema.sanitize(null)).to.be.equal(null);
        expect(schema.sanitize(true)).to.be.equal(null);
        expect(schema.sanitize(false)).to.be.equal(null);
        expect(schema.sanitize("")).to.be.equal(null);
        expect(schema.sanitize("Random String")).to.be.equal(null);
        expect(schema.sanitize(0)).to.be.equal(null);
        expect(schema.sanitize(NaN)).to.be.equal(null);
        expect(schema.sanitize(new Date())).to.be.equal(null);
        expect(schema.sanitize([])).to.be.equal(null);
        expect(schema.sanitize(["", "Test String"])).to.be.equal(null);
        expect(schema.sanitize({})).to.be.equal(null);
        expect(schema.sanitize(BigInt(20))).to.be.equal(null);
    });

    it('Should acccept optional values', () => {
        const schema = ObjectSchema.create()
            .withProperty("req", ObjectSchema.string().withDefaultValue(""))
            .withProperty("opt", ObjectSchema.optional(ObjectSchema.string().withDefaultValue("")));

        expect(schema.test({ req: "Example Required", opt: "Example Optional" })).to.be.true;
        expect(schema.test({ req: "Example Required" })).to.be.true;

        expect(schema.test({ opt: "Example Optional" })).to.be.false;
        expect(schema.test({})).to.be.false;

        expect(schema.sanitize({ req: "Example Required", opt: "Example Optional" })).to.be.eql({ req: "Example Required", opt: "Example Optional" });
        expect(schema.sanitize({ req: "Example Required" })).to.be.eql({ req: "Example Required" });
        expect(schema.sanitize({ opt: "Example Optional" })).to.be.eql({ req: "", opt: "Example Optional" });
        expect(schema.sanitize({})).to.be.eql({ req: "" });
    });
});
