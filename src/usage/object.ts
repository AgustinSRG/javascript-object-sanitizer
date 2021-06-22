// Javascript object sanitizer

"use strict";

import { ObjectRawSchema } from "../schema-raw";
import { AnyOfObjectSchema } from "./anyof";
import { ArrayObjectSchema } from "./array";
import { BooleanObjectSchema } from "./boolean";
import { CustomObjectSchema } from "./custom";
import { NumberObjectSchema } from "./number";
import { RecursiveObjectSchema } from "./recursive";
import { AbstractObjectSchema, ObjectSchemaI } from "./schema";
import { StringObjectSchema } from "./string";

/**
 * Object schema
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
     * Schema to represent a real number
     * @returns a new schema instance
     */
    public static number(): NumberObjectSchema {
        return NumberObjectSchema.create();
    }

    /**
     * Schema to represent an integer
     * @returns a new schema instance
     */
    public static integer(): NumberObjectSchema {
        return NumberObjectSchema.create().forceInteger();
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

    /**
     * Schema for recursive references
     * @returns a new schema instance
     */
    public static recursive(): RecursiveObjectSchema {
        return RecursiveObjectSchema.create();
    }

    /**
     * Parent recursive reference
     * @returns a new schema instance
     */
    public static parent(): RecursiveObjectSchema {
        return RecursiveObjectSchema.create();
    }

    /**
     * The object should match one of the provided schemas
     * @param schemas List of schemas
     * @returns a new schema instance
     */
    public static anyOf(schemas: ObjectSchemaI[]): AnyOfObjectSchema {
        return AnyOfObjectSchema.create(schemas);
    }

    /**
     * Makes schema optional. This means undefined is allowed for test()
     * @param schema The schema
     * @returns a new schema instance
     */
    public static optional(schema: ObjectSchemaI): AnyOfObjectSchema {
        return AnyOfObjectSchema.create([
            ObjectSchema.undefined(),
            schema
        ]).withDefaultSchema(schema);
    }

    /**
     * Schema for object type
     * @returns a new schema instance
     */
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
    public withProperty(propName: string, schema: ObjectSchemaI): ObjectSchema {
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
    public withPropertyFilter(extraPropsFilter?: (key: string) => boolean, extraPropsSchema?: (key: string) => ObjectSchemaI): ObjectSchema {
        this.schema.$extraPropsFilter = extraPropsFilter;
        this.schema.$extraPropsSchema = a => {
            return extraPropsSchema(a).getRawSchema();
        };
        return this;
    }
}
