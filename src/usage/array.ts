// Javascript object sanitizer

"use strict";

import { ArrayRawSchema } from "../schema-raw";
import { AbstractObjectSchema, ObjectSchemaI } from "./schema";

/**
 * Schema for Array
 */
export class ArrayObjectSchema extends AbstractObjectSchema {
    /**
     * Creates array schema
     * @param itemsSchema Schema for the array items
     * @returns a new instance of ArrayObjectSchema
     */
    public static create(itemsSchema: ObjectSchemaI): ArrayObjectSchema {
        return new ArrayObjectSchema(itemsSchema);
    }

    private schema: ArrayRawSchema;

    /**
     * Constructor
     */
    constructor(itemsSchema: ObjectSchemaI) {
        super({
            $type: "array",
            $items: itemsSchema.getRawSchema(),
        });
        this.schema = <ArrayRawSchema>this.getRawSchema();
    }

    /**
     * Sets default value, in case the object is null, undefined or cannot be parsed
     * @param defaultValue The default value
     * @returns self
     */
    public withDefaultValue(defaultValue: any[]): ArrayObjectSchema {
        this.schema.$default = defaultValue;
        return this;
    }

    /**
     * Sets max length for the array. If the array length is greater than this value, it will be truncated.
     * @param maxLength The max length for the array.
     * @returns self
     */
    public withMaxLength(maxLength: number): ArrayObjectSchema {
        this.schema.$maxLength = maxLength;
        return this;
    }
}
