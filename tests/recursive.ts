// Recursive reference Test

"use strict";

import { expect } from 'chai';
import { ObjectSchema } from '../src/index';

describe("Recursive schemas testing", () => {
    it('Should properly apply parent schema', () => {
        const schema = ObjectSchema.object({
            name: ObjectSchema.string().withDefaultValue(""),
            childA: ObjectSchema.optional(ObjectSchema.recursive().withReference("node")),
            childB: ObjectSchema.optional(ObjectSchema.recursive().withReference("node")),
        }).withId("node");

        // Match

        expect(schema.test({
            name: "root",
        })).to.be.true;

        expect(schema.test({
            name: "root",
            childA: {
                name: "ChildA"
            },
            childB: {
                name: "ChildB"
            },
        })).to.be.true;

        expect(schema.test({
            name: "root",
            childA: {
                name: "ChildA",
                childB: {
                    name: "ChildA.ChildB"
                }
            },
            childB: {
                name: "ChildB"
            },
        })).to.be.true;

        expect(schema.test({
            name: "root",
            childA: true,
        })).to.be.false;

        expect(schema.test({
            name: "root",
            childA: {},
        })).to.be.false;

        // Sanitize

        expect(schema.sanitize({
            name: "root",
        })).to.be.eql({
            name: "root",
        });

        expect(schema.sanitize({
            name: "root",
            childA: {
                name: "ChildA"
            },
            childB: {
                name: "ChildB"
            },
        })).to.be.eql({
            name: "root",
            childA: {
                name: "ChildA"
            },
            childB: {
                name: "ChildB"
            },
        });

        expect(schema.sanitize({
            name: "root",
            childA: {
                name: "ChildA",
                childB: {
                    name: "ChildA.ChildB"
                }
            },
            childB: {
                name: "ChildB"
            },
        })).to.be.eql({
            name: "root",
            childA: {
                name: "ChildA",
                childB: {
                    name: "ChildA.ChildB"
                }
            },
            childB: {
                name: "ChildB"
            },
        });

        expect(schema.sanitize({
            name: "root",
            childA: true,
        })).to.be.eql({
            name: "root",
            childA: {
                name: "",
            }
        });

        expect(schema.sanitize({
            name: "root",
            childA: {},
        })).to.be.eql({
            name: "root",
            childA: {
                name: "",
            }
        });
    });

    it('Should reject recursion deeper than allowed', () => {
        const schema = ObjectSchema.object({
            name: ObjectSchema.string().withDefaultValue(""),
            childA: ObjectSchema.optional(ObjectSchema.recursive().withReference("node").withMaxRecursion(1)),
            childB: ObjectSchema.optional(ObjectSchema.recursive().withReference("node").withMaxRecursion(1)),
        }).withId("node");

        // Match

        
        expect(schema.test({
            name: "root",
        })).to.be.true;

        expect(schema.test({
            name: "root",
            childA: {
                name: "ChildA"
            },
            childB: {
                name: "ChildB"
            },
        })).to.be.true;

        expect(schema.test({
            name: "root",
            childA: {
                name: "ChildA",
                childB: {
                    name: "ChildA.ChildB"
                }
            },
            childB: {
                name: "ChildB"
            },
        })).to.be.false;

        // Sanitize

        expect(schema.sanitize({
            name: "root",
        })).to.be.eql({
            name: "root",
        });

        expect(schema.sanitize({
            name: "root",
            childA: {
                name: "ChildA"
            },
            childB: {
                name: "ChildB"
            },
        })).to.be.eql({
            name: "root",
            childA: {
                name: "ChildA"
            },
            childB: {
                name: "ChildB"
            },
        });

        expect(schema.sanitize({
            name: "root",
            childA: {
                name: "ChildA",
                childB: {
                    name: "ChildA.ChildB"
                }
            },
            childB: {
                name: "ChildB"
            },
        })).to.be.eql({
            name: "root",
            childA: {
                name: "ChildA",
            },
            childB: {
                name: "ChildB"
            },
        });
    });
});
