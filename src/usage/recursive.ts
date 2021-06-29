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
        });
        this.schema = <RecursiveRawSchema>this.getRawSchema();
    }

    /**
     * Set number of levels up to raise in the schema. Defaults to 1 (parent)
     * @param up Levels to raise in the schema
     * @returns self
     */
    public withLevelsUp(up: number): RecursiveObjectSchema {
        this.schema.$levelsUp = up;
        return this;
    }

    /**
     * Sets the recursive reference, based on parent id
     * @param ref The Node id to reference
     * @returns self
     */
    public withReference(ref: string): RecursiveObjectSchema {
        this.schema.$ref = ref;
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
