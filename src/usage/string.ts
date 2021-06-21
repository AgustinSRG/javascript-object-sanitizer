// Javascript object sanitizer

"use strict";

import { StringRawSchema } from "../schema-raw";
import { AbstractObjectSchema } from "./schema";

/**
 * String schema
 */
export class StringObjectSchema extends AbstractObjectSchema {
    /**
     * Creates string schema
     * @returns a new instance of StringObjectSchema
     */
    public static create(): StringObjectSchema {
        return new StringObjectSchema();
    }

    private schema: StringRawSchema;

    /**
     * Constructor
     */
    constructor() {
        super({
            $type: "string",
        });
        this.schema = <StringRawSchema>this.getRawSchema();
    }

    /**
     * Sets default value, in case the object is null, undefined or cannot be parsed
     * @param defaultValue The default value
     * @returns self
     */
    public withDefaultValue(defaultValue: string): StringObjectSchema {
        this.schema.$default = defaultValue;
        return this;
    }

    /**
     * Sets max length for the string. If the string length is greater than this value, it will be truncated.
     * @param maxLength The max length for the string.
     * @returns self
     */
    public withMaxLength(maxLength: number): StringObjectSchema {
        this.schema.$maxLength = maxLength;
        return this;
    }

    /**
     * Sets a regular expression the string must match
     * @param regExp The regular expression
     * @returns self
     */
    public withRegularExpression(regExp: RegExp): StringObjectSchema {
        this.schema.$match = regExp;
        return this;
    }

    /**
     * Sets an enumeration of allowed values
     * @param enumeration The enumeration
     * @returns self
     */
    public withEnumeration(enumeration: string[]): StringObjectSchema {
        this.schema.$enum = enumeration;
        return this;
    }
}
