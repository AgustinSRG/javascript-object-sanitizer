// Javascript object sanitizer

"use strict";

import { BooleanSchema } from "../schema-raw";
import { AbstractObjectSchema } from "./schema";

export class BooleanObjectSchema extends AbstractObjectSchema {
    /**
     * Creates boolean schema
     * @returns a new instance of BooleanObjectSchema
     */
    public static create(): BooleanObjectSchema {
        return new BooleanObjectSchema();
    }

    private schema: BooleanSchema;

    /**
     * Constructor
     */
    constructor() {
        super({
            $type: "boolean",
        });
        this.schema = <BooleanSchema>this.getRawSchema();
    }

    /**
     * Sets default value, in case the object is null, undefined or cannot be parsed
     * @param defaultValue The default value
     * @returns self
     */
    public setDefaultValue(defaultValue: boolean): BooleanObjectSchema {
        this.schema.$default = defaultValue;
        return this;
    }

    /**
     * Sets an enumeration of allowed values
     * @param enumeration The enumeration
     * @returns self
     */
    public setEnumeration(enumeration: boolean[]): BooleanObjectSchema {
        this.schema.$enum = enumeration;
        return this;
    }
}