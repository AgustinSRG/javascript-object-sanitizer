// Extends Test

"use strict";

import { expect } from 'chai';
import { ObjectSchema } from '../src/index';

describe("Extending schemas testing", () => {
    it('Should extend root schema properly', () => {
        const schema = ObjectSchema.object({
            name: ObjectSchema.string().withDefaultValue(""),
            surname: ObjectSchema.string().withDefaultValue(""),
        }).withId("person");

        const extendedSchema = ObjectSchema.extend(schema, {
            person: {
                age: ObjectSchema.integer().withMin(0).withDefaultValue(0),
            },
        })

        // Match

        expect(schema.test({
            name: "Test",
            surname: "TestSur"
        })).to.be.true;

        expect(extendedSchema.test({
            name: "Test",
            surname: "TestSur"
        })).to.be.false;

        expect(extendedSchema.test({
            name: "Test",
            surname: "TestSur",
            age: 18,
        })).to.be.true;

        // Sanitize

        expect(extendedSchema.sanitize({
            name: "Test",
            surname: "TestSur",
        })).to.be.eql({
            name: "Test",
            surname: "TestSur",
            age: 0,
        });

        expect(extendedSchema.sanitize({
            name: "Test",
            surname: "TestSur",
            age: 18,
        })).to.be.eql({
            name: "Test",
            surname: "TestSur",
            age: 18,
        });
    });

    it('Should extend children schema properly', () => {
        const schema = ObjectSchema.object({
            person: ObjectSchema.object({
                name: ObjectSchema.string().withDefaultValue(""),
                surname: ObjectSchema.string().withDefaultValue(""),
            }).withId("person"),
        }).withId("root");

        const extendedSchema = ObjectSchema.extend(schema, {
            person: {
                age: ObjectSchema.integer().withMin(0).withDefaultValue(0),
            },
        });

        // Match

        expect(schema.test({
            person: {
                name: "Test",
                surname: "TestSur"
            },
        })).to.be.true;

        expect(extendedSchema.test({
            person: {
                name: "Test",
                surname: "TestSur"
            },
        })).to.be.false;

        expect(extendedSchema.test({
            person: {
                name: "Test",
                surname: "TestSur",
                age: 18,
            },
        })).to.be.true;

        // Sanitize

        expect(extendedSchema.sanitize({
            person: {
                name: "Test",
                surname: "TestSur"
            },
        })).to.be.eql({
            person: {
                name: "Test",
                surname: "TestSur",
                age: 0,
            },
        });

        expect(extendedSchema.sanitize({
            person: {
                name: "Test",
                surname: "TestSur",
                age: 18,
            },
        })).to.be.eql({
            person: {
                name: "Test",
                surname: "TestSur",
                age: 18,
            },
        });
    });
});
