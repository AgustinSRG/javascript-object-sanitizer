// Javascript object sanitizer

"use strict";

import { extendObjectSchema } from "../extends";
import { ObjectRawSchema, RawObjectSchema } from "../schema-raw";
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
     * Schema from raw representation
     * @param raw Raw schema representation
     * @returns a new schema instance
     */
    public static fromRaw(raw: ObjectRawSchema): ObjectSchemaI {
        return new AbstractObjectSchema(raw);
    }

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
        return RecursiveObjectSchema.create().withLevelsUp(1);
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
            new AbstractObjectSchema({ $type: "null-undefined" }),
            schema
        ]).withDefaultSchema(schema);
    }

    /**
     * Extends schema. For object schemas with pre-defined keys
     * @param schema Parent schema
     * @param ext Extension info
     * @returns Extended schema
     */
    public static extend(schema: ObjectSchemaI, ext: { [id: string]: { [prop: string]: ObjectSchemaI } }): ObjectSchemaI {
        if (!ext) {
            ext = Object.create(null);
        }
        const extRaw: { [id: string]: { [prop: string]: RawObjectSchema } } = Object.create(null);
        for (const id of Object.keys(ext)) {
            extRaw[id] = Object.create(null);
            if (ext[id]) {
                for (const key of Object.keys(ext[id])) {
                    extRaw[id][key] = ext[id][key].getRawSchema();
                }
            }
        }
        return new AbstractObjectSchema(extendObjectSchema(schema.getRawSchema(), extRaw));
    }

    /**
     * Schema for object type
     * @returns a new schema instance
     */
    public static create(): ObjectSchema {
        return new ObjectSchema();
    }

    /**
     * Schema for object type (with a set of properties)
     * @param props Properties
     * @returns a new schema instance
     */
    public static object(props: { [propName: string]: ObjectSchemaI }): ObjectSchema {
        return ObjectSchema.create().withProperties(props);
    }

    /**
     * Schema for dictionary (key => value)
     * @param propsFilter Property filter
     * @param propsSchema Function to determine schema for properties
     * @returns a new schema instance
     */
    public static dict(propsFilter: (key: string) => boolean, propsSchema: (key: string) => ObjectSchemaI): ObjectSchema {
        return ObjectSchema.create().withPropertyFilter(propsFilter, propsSchema);
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
     * Sets required properties for the object
     * @param props Properties
     * @returns self
     */
    public withProperties(props: { [propName: string]: ObjectSchemaI }): ObjectSchema {
        if (!this.schema.$props) {
            this.schema.$props = Object.create(null);
        }

        for (const prop of Object.keys(props)) {
            this.schema.$props[prop] = props[prop].getRawSchema();
        }

        return this;
    }

    /**
     * Sets property filter for dynamic dictionaries
     * @param extraPropsFilter Function to filter the the propeties
     * @param extraPropsSchema Function to determine the schema to use in each case
     * @returns self
     */
    public withPropertyFilter(extraPropsFilter: (key: string) => boolean, extraPropsSchema: (key: string) => ObjectSchemaI): ObjectSchema {
        this.schema.$extraPropsFilter = extraPropsFilter;
        this.schema.$extraPropsSchema = a => {
            return extraPropsSchema(a).getRawSchema();
        };
        return this;
    }

    /**
     * Sets the ID for this schema to be referenced by its children
     * for recursion
     * @param id The identifier of the schema node
     * @returns self
     */
    public withId(id: string): ObjectSchema {
        this.schema.$id = id;
        return this;
    }
}
