// Javascript object sanitizer

"use strict";

import { NumberSchema } from "../schema-raw";
import { AbstractObjectSchema } from "./schema";

export class NumberObjectSchema extends AbstractObjectSchema {
    /**
     * Creates number schema
     * @returns a new instance of NumberObjectSchema
     */
    public static create(): NumberObjectSchema {
        return new NumberObjectSchema();
    }

    private schema: NumberSchema;

    /**
     * Constructor
     */
    constructor() {
        super({
            $type: "number",
            $nan: false,
            $finite: true,
        });
        this.schema = <NumberSchema>this.getRawSchema();
    }

    /**
     * Sets default value, in case the object is null, undefined or cannot be parsed
     * @param defaultValue The default value
     * @returns self
     */
    public setDefaultValue(defaultValue: number): NumberObjectSchema {
        this.schema.$default = defaultValue;
        return this;
    }

    /**
     * Forces number to integer
     * @returns self
     */
    public forceInteger(): NumberObjectSchema {
        this.schema.$format = "integer";
        return this;
    }

    /**
     * Allows NaN as an option.
     * By default, if NaN, the default value is set.
     * @returns self
     */
    public allowNaN(): NumberObjectSchema {
        this.schema.$nan = true;
        return this;
    }

    /**
     * Allos Infinite values
     * By default, infinite values are ignored, and default value is set.
     * @returns self
     */
    public allowInfinite(): NumberObjectSchema {
        this.schema.$finite = false;
        return this;
    }

    /**
     * Sets the min value. If the value is lower, this value will be set.
     * @param min The min value
     * @returns self
     */
    public setMin(min: number): NumberObjectSchema {
        this.schema.$min = min;
        return this
    }

    /**
     * Sets the max value. if the value is greater, this value will be set.
     * @param max The max value
     * @returns self
     */
    public setMax(max: number): NumberObjectSchema {
        this.schema.$max = max;
        return this
    }

    /**
     * Sets an enumeration of allowed values
     * @param enumeration The enumeration
     * @returns self
     */
    public setEnumeration(enumeration: number[]): NumberObjectSchema {
        this.schema.$enum = enumeration;
        return this;
    }
}
