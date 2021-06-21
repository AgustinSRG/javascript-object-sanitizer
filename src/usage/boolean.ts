// Javascript object sanitizer

"use strict";

import { BooleanRawSchema } from "../schema-raw";
import { AbstractObjectSchema } from "./schema";

/**
 * Schema for boolean
 */
export class BooleanObjectSchema extends AbstractObjectSchema {
    /**
     * Creates boolean schema
     * @returns a new instance of BooleanObjectSchema
     */
    public static create(): BooleanObjectSchema {
        return new BooleanObjectSchema();
    }

    private schema: BooleanRawSchema;

    /**
     * Constructor
     */
    constructor() {
        super({
            $type: "boolean",
        });
        this.schema = <BooleanRawSchema>this.getRawSchema();
    }

    /**
     * Sets default value, in case the object is null, undefined or cannot be parsed
     * @param defaultValue The default value
     * @returns self
     */
    public withDefaultValue(defaultValue: boolean): BooleanObjectSchema {
        this.schema.$default = defaultValue;
        return this;
    }

    /**
     * Sets an enumeration of allowed values
     * @param enumeration The enumeration
     * @returns self
     */
    public withEnumeration(enumeration: boolean[]): BooleanObjectSchema {
        this.schema.$enum = enumeration;
        return this;
    }
}
