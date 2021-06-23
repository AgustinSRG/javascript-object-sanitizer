// Recursive reference Test

"use strict";

import { expect } from 'chai';
import { ObjectSchema } from '../src/index';

describe("Multi-option schema testing", () => {
    it('Should accept only values that match one of the provided schemas', () => {
        const schema = ObjectSchema.anyOf([
            ObjectSchema.integer(),
            ObjectSchema.string(),
        ]).withDefaultSchema(ObjectSchema.null());

        expect(schema.test("")).to.be.true;
        expect(schema.test("Random string")).to.be.true;
        expect(schema.test(0)).to.be.true;
        expect(schema.test(1)).to.be.true;

        expect(schema.test(undefined)).to.be.false;
        expect(schema.test(null)).to.be.false;
        expect(schema.test(true)).to.be.false;
        expect(schema.test(false)).to.be.false;
        expect(schema.test(new Date())).to.be.false;
        expect(schema.test(0.1)).to.be.false;
        expect(schema.test([])).to.be.false;
        expect(schema.test(["", "Test String"])).to.be.false;
        expect(schema.test({})).to.be.false;
        expect(schema.test(BigInt(20))).to.be.false;
    });

    it('Should apply schemas in order', () => {
        const schema = ObjectSchema.anyOf([
            ObjectSchema.integer(),
            ObjectSchema.string(),
        ]).withDefaultSchema(ObjectSchema.null());

        expect(schema.sanitize("")).to.be.equal("");
        expect(schema.sanitize("Random string")).to.be.equal("Random string");
        expect(schema.sanitize(0)).to.be.equal(0);
        expect(schema.sanitize(1)).to.be.equal(1);

        expect(schema.sanitize(undefined)).to.be.equal(null);
        expect(schema.sanitize(null)).to.be.equal(null);
        expect(schema.sanitize(true)).to.be.equal(null);
        expect(schema.sanitize(false)).to.be.equal(null);
        expect(schema.sanitize(new Date())).to.be.equal(null);
        expect(schema.sanitize(0.1)).to.be.equal(null);
        expect(schema.sanitize([])).to.be.equal(null);
        expect(schema.sanitize(["", "Test String"])).to.be.equal(null);
        expect(schema.sanitize({})).to.be.equal(null);
        expect(schema.sanitize(BigInt(20))).to.be.equal(null);
    });
});
