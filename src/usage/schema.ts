// Javascript object sanitizer

"use strict";

import { matchesSchema } from "../match";
import { sanitizeObject } from "../sanitizer";
import { RawObjectSchema } from "../schema-raw";

/**
 * Javascript object schema interface (any)
 */
export interface ObjectSchemaI {
    /**
     * Gets the raw schema, as object type
     */
    getRawSchema(): RawObjectSchema;

    /**
     * Tests the schema against an object
     * @param object The object to test
     * @returns true if it matches the schema, false if it does not match
     */
    test(object: any): boolean;

    /**
     * Provides the reason test() returned false, if any
     * @param object The object to test
     * @returns The provided error
     */
    provideTestError(object: any): Error;

    /**
     * Sanitizes an object.
     * @param object The object to test
     * @returns The sanitized object
     */
    sanitize(object: any): any;
}

/**
 * Abstract schema, for inheritance
 */
export class AbstractObjectSchema implements ObjectSchemaI {
    private raw: RawObjectSchema;

    /**
     * Constructor
     * @param raw Raw schema
     */
    constructor(raw: RawObjectSchema) {
        this.raw = raw;
    }

    /**
     * Gets the raw schema, as object type
     */
    public getRawSchema(): RawObjectSchema {
        return this.raw;
    }

    /**
     * Tests the schema against an object
     * @param object The object to test
     * @returns true if it matches the schema, false if it does not match
     */
    public test(object: any): boolean {
        return matchesSchema(object, this.raw);
    }

    /**
     * Provides the reason test() returned false, if any
     * @param object The object to test
     * @returns The provided error
     */
    public provideTestError(object: any): Error {
        try {
            matchesSchema(object, this.raw, true);
        } catch (ex) {
            return ex;
        }
        return null;
    }

    /**
     * Sanitizes an object.
     * @param object The object to test
     * @returns The sanitized object
     */
    public sanitize(object: any) {
        return sanitizeObject(object, this.raw);
    }
}
