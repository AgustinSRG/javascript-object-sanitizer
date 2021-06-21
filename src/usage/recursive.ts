// Javascript object sanitizer

"use strict";

import { RecursiveRawSchema } from "../schema-raw";
import { AbstractObjectSchema } from "./schema";

/**
 * Schema for recursive references
 */
export class RecursiveObjectSchema extends AbstractObjectSchema {
    /**
     * Creates recursive schema
     * @returns a new instance of RecursiveObjectSchema
     */
    public static create(): RecursiveObjectSchema {
        return new RecursiveObjectSchema();
    }

    private schema: RecursiveRawSchema;

    /**
     * Constructor
     */
    constructor() {
        super({
            $type: "recursive",
            $ref: 1,
        });
        this.schema = <RecursiveRawSchema>this.getRawSchema();
    }

    /**
     * Set number of levels up to raise in the schema. Defaults to 1 (parent)
     * @param up Levels to raise in the schema
     * @returns self
     */
    public withReference(up: number): RecursiveObjectSchema {
        this.schema.$ref = up;
        return this;
    }

    /**
     * Sets default value if max recursion is reached
     * @param defaultValue The default value
     * @returns self
     */
    public withDefaultValue(defaultValue: any): RecursiveObjectSchema {
        this.schema.$default = defaultValue;
        return this;
    }

    /**
     * Sets max recursion allowed. Default has no limit.
     * @param maxRecursion Max levels of recursion allowed
     * @returns self
     */
    public withMaxRecursion(maxRecursion: number): RecursiveObjectSchema {
        this.schema.$maxRecursion = maxRecursion;
        return this;
    }
}
