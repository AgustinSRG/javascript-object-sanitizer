// Extends funcionality
// Allows to copy an schema and extend it

"use strict";

import { RawObjectSchema } from "./schema-raw";

export function extendObjectSchema(schema: RawObjectSchema, ext: { [id: string]: { [prop: string]: RawObjectSchema } }): RawObjectSchema {
    switch (schema.$type) {
    case "null":
        return { $type: "null" };
    case "undefined":
        return { $type: "undefined" };
    case "custom":
    {
        return {
            $type: "custom",
            $sanitize: schema.$sanitize,
            $test: schema.$test,
        };
    }
    case "string":
        return {
            $type: "string",
            $maxLength: schema.$maxLength,
            $match: schema.$match,
            $enum: schema.$enum ? schema.$enum.slice() : undefined,
            $default: schema.$default,
        };
    case "number":
        return {
            $type: "number",
            $nan: schema.$nan,
            $finite: schema.$finite,
            $format: schema.$format,
            $min: schema.$min,
            $max: schema.$max,
            $enum: schema.$enum ? schema.$enum.slice() : undefined,
            $default: schema.$default,
        };
    case "boolean":
        return {
            $type: "boolean",
            $enum: schema.$enum ? schema.$enum.slice() : undefined,
            $default: schema.$default,
        };
    case "array":
        return {
            $type: "array",
            $items: extendObjectSchema(schema.$items, ext),
            $maxLength: schema.$maxLength,
            $id: schema.$id,
            $default: schema.$default,
        };
    case "object":
    {
        let props = schema.$props;

        if (props !== undefined) {
            props = Object.create(null);
            for (const key of Object.keys(schema.$props)) {
                props[key] = extendObjectSchema(schema.$props[key], ext);
            }
        }

        if (props !== undefined && schema.$id !== undefined && ext[schema.$id]) {
            const toExtend = ext[schema.$id];
            for (const key of Object.keys(toExtend)) {
                props[key] = toExtend[key];
            }
        }

        return {
            $type: "object",
            $id: schema.$id,
            $props: props,
            $extraPropsFilter: schema.$extraPropsFilter,
            $extraPropsSchema: schema.$extraPropsSchema,
        };
    }
    case "recursive":
        return {
            $type: "recursive",
            $ref: schema.$ref,
            $levelsUp: schema.$levelsUp,
            $maxRecursion: schema.$maxRecursion,
        };
    case "anyof":
        return {
            $type: "anyof",
            $id: schema.$id,
            $schemas: schema.$schemas.map(s => extendObjectSchema(s, ext)),
            $default: extendObjectSchema(schema.$default, ext),
        };
    default:
        return null;
    }
}
