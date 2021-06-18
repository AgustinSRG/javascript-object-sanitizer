// Javascript object sanitizer

"use strict";

import { CustomSanitizeRawSchema } from "../schema-raw";
import { AbstractObjectSchema } from "./schema";

/**
 * Custom sanitizer schema
 */
export class CustomObjectSchema extends AbstractObjectSchema {
    /**
     * Creates a custom object schema.
     * You can set custom tester and sanitizer functions.
     * @returns a new instance of CustomObjectSchema
     */
    public static create(): CustomObjectSchema {
        return new CustomObjectSchema(() => true, a => a);
    }

    private schema: CustomSanitizeRawSchema;

    /**
     * Constructor
     * @param test Schema tester 
     * @param sanitize Schema sanitizer
     */
    constructor(test: (object: any) => boolean, sanitize: (object: any) => any) {
        super({
            $type: "custom",
            $sanitize: sanitize,
            $test: test,
        });
        this.schema = <CustomSanitizeRawSchema>this.getRawSchema();
    }

    /**
     * Sets custom tester
     * @param test Schema tester
     * @returns self
     */
    public setTester(test: (object: any) => boolean): CustomObjectSchema {
        this.schema.$test = test;
        return this;
    }

    /**
     * Sets custom sanitizer
     * @param sanitize Schema sanitizer
     * @returns self
     */
    public setSanitizer(sanitize: (object: any) => any): CustomObjectSchema {
        this.schema.$sanitize = sanitize;
        return this;
    }
}
