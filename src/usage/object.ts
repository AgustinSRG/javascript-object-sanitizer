// Javascript object sanitizer

"use strict";

import { ObjectRawSchema } from "../schema-raw";
import { ArrayObjectSchema } from "./array";
import { BooleanObjectSchema } from "./boolean";
import { CustomObjectSchema } from "./custom";
import { NumberObjectSchema } from "./number";
import { AbstractObjectSchema, ObjectSchemaI } from "./schema";
import { StringObjectSchema } from "./string";

/**
 * Class with static methods to create chemas
 */
export class ObjectSchema extends AbstractObjectSchema {
    /**
     * Schema to represent the null value
     * @returns a new schema instance
     */
    public static null(): ObjectSchemaI {
        return new AbstractObjectSchema({ $type: "null" });
    }

    /**
     * Schema to represent the undefined value
     * @returns a new schema instance
     */
    public static undefined(): ObjectSchemaI {
        return new AbstractObjectSchema({ $type: "undefined" });
    }

    /**
     * Schema with custom tester and sanitizer
     * @returns a new schema instance
     */
    public static custom(): CustomObjectSchema {
        return CustomObjectSchema.create();
    }

    /**
     * Schema to represent a string
     * @returns a new schema instance
     */
    public static string(): StringObjectSchema {
        return StringObjectSchema.create();
    }

    /**
     * Schema to represent a number
     * @returns a new schema instance
     */
    public static number(): NumberObjectSchema {
        return NumberObjectSchema.create();
    }

    /**
     * Schema to represent a boolean
     * @returns a new schema instance
     */
    public static boolean(): BooleanObjectSchema {
        return BooleanObjectSchema.create();
    }

    /**
     * Schema to represent an array
     * @param itemsSchema Schema for the items of the array
     * @returns a new schema instance
     */
    public static array(itemsSchema: ObjectSchemaI): ArrayObjectSchema {
        return ArrayObjectSchema.create(itemsSchema);
    }

    public static create(): ObjectSchema {
        return new ObjectSchema();
    }

    private schema: ObjectRawSchema;

    /**
     * Constructor
     */
    constructor() {
        super({
            $type: "object",
        });
        this.schema = <ObjectRawSchema>this.getRawSchema();
    }

    /**
     * Sets default value, in case the object is null, undefined or cannot be parsed
     * @param defaultValue The default value
     * @returns self
     */
    public setDefaultValue(defaultValue: any): ObjectSchema {
        this.schema.$default = defaultValue;
        return this;
    }

    /**
     * Add property to the object schema
     * @param propName The name of the property
     * @param schema The schema for the property
     * @returns self
     */
    public addProperty(propName: string, schema: ObjectSchemaI): ObjectSchema {
        if (!this.schema.$props) {
            this.schema.$props = Object.create(null);
        }

        this.schema.$props[propName] = schema.getRawSchema();

        return this;
    }

    /**
     * Sets property filter for dynamic dictionaries
     * @param extraPropsFilter Function to filter the the propeties
     * @param extraPropsSchema Function to determine the schema to use in each case
     * @returns self
     */
    public setPropertyFilter(extraPropsFilter?: (key: string) => boolean, extraPropsSchema?: (key: string) => ObjectSchemaI): ObjectSchema {
        this.schema.$extraPropsFilter = extraPropsFilter;
        this.schema.$extraPropsSchema = a => {
            return extraPropsSchema(a).getRawSchema();
        };
        return this;
    }
}