// Javascript object sanitizer

"use strict";

import { AnyOfRawSchema, RawObjectSchema } from "../schema-raw";
import { AbstractObjectSchema, ObjectSchemaI } from "./schema";

/**
 * Schema foor multiple options
 */
export class AnyOfObjectSchema extends AbstractObjectSchema {
    /**
     * Creates anyof schema
     * @returns a new instance of AnyOfObjectSchema
     */
    public static create(options: ObjectSchemaI[]): AnyOfObjectSchema {
        return new AnyOfObjectSchema(options);
    }

    private schema: AnyOfRawSchema;

    /**
     * Constructor
     */
    constructor(options: ObjectSchemaI[]) {
        super({
            $type: "anyof",
            $schemas: options.map(o => o.getRawSchema()),
            $default: {
                $type: "undefined",
            },
        });
        this.schema = <AnyOfRawSchema>this.getRawSchema();

        if (this.schema.$schemas.length > 0) {
            this.schema.$default = this.schema.$schemas[this.schema.$schemas.length - 1];
        }
    }

    /**
     * Sets default schema if any of the options won't fit
     * @param defaultSchema The default schema
     * @returns self
     */
    public withDefaultSchema(defaultSchema: ObjectSchemaI): AnyOfObjectSchema {
        this.schema.$default = defaultSchema.getRawSchema();
        return this;
    }

    /**
     * Sets the ID for this schema to be referenced by its children
     * for recursion
     * @param id The identifier of the schema node
     * @returns self
     */
    public withId(id: string): AnyOfObjectSchema {
        this.schema.$id = id;
        return this;
    }
}
