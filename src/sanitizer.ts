// Sanitizer function

"use strict";

import { matchesSchema } from "./match";
import { RawObjectSchema } from "./schema-raw";

/**
 * Sanitize function. Takes an object and forces it
 * to match the specific schema.
 * @param object Object to sanitize
 * @param schema Schema to apply
 */
export function sanitizeObject(object: any, schema: RawObjectSchema, parentStack?: RawObjectSchema[], currentRecursion?: number): any {
    switch (schema.$type) {
    case "null":
        return null;
    case "undefined":
        return undefined;
    case "custom":
        return schema.$sanitize(object);
    case "string":
        if (typeof object !== "string") {
            // Not string, turn into string
            if (object === undefined || object === null) {
                return schema.$default;
            }
            if (typeof object !== "object") {
                object = "" + object; // Conversion
            } else {
                if (object instanceof Array) {
                    object = object.join();
                } else if (object instanceof Date) {
                    object = object.toISOString();
                } else {
                    return schema.$default;
                }
            }
        }
        if (schema.$maxLength !== undefined && schema.$maxLength < (<string>object).length) {
            object = (<string>object).substr(0, schema.$maxLength)
        }
        if (schema.$match !== undefined && !schema.$match.test((<string>object))) {
            return schema.$default;
        }
        if (schema.$enum !== undefined && !schema.$enum.includes(<string>object)) {
            return schema.$default;
        }
        return object;
    case "number":
        if (typeof object !== "number") {
            if (object === undefined || object === null) {
                return schema.$default;
            }
            object = Number(object);
        }
        if (schema.$nan !== undefined && !schema.$nan && isNaN(object)) {
            return schema.$default;
        }
        if (schema.$finite !== undefined && schema.$finite && !isFinite(object)) {
            return schema.$default;
        }
        if (schema.$format !== undefined && schema.$format === "integer") {
            object = Math.floor(object);
        }
        if (schema.$min !== undefined && object < schema.$min) {
            object = schema.$min;
        }
        if (schema.$max !== undefined && object > schema.$max) {
            object = schema.$max;
        }
        if (schema.$enum !== undefined && !schema.$enum.includes(object)) {
            return schema.$default;
        }
        return object;
    case "boolean":
        if (typeof object !== "boolean") {
            if (object === undefined || object === null) {
                return schema.$default;
            }
            object = !!object;
        }
        if (schema.$enum !== undefined && !schema.$enum.includes(object)) {
            return schema.$default;
        }
        return object;
    case "array":
        if (!(object instanceof Array)) {
            return schema.$default;
        }
        if (schema.$maxLength !== undefined && schema.$maxLength < object.length) {
            object = object.slice(0, schema.$maxLength);
        }
        return object.map(item => {
            return sanitizeObject(item, schema.$items, (parentStack || []).concat(schema), currentRecursion);
        });
    case "object":
        if (typeof object !== "object" || object === null) {
            return schema.$default;
        } else {
            const result: any = Object.create(null);

            if (schema.$props !== undefined) {
                // Required props
                for (const prop of Object.keys(schema.$props)) {
                    const child = object[prop];
                    const childSchema = schema.$props[prop];
                    result[prop] = sanitizeObject(child, childSchema, (parentStack || []).concat(schema), currentRecursion);
                }
            }
            if (schema.$extraPropsFilter !== undefined && schema.$extraPropsSchema !== undefined) {
                for (const extraProp of Object.keys(object)) {
                    if (schema.$props !== undefined && schema.$props[extraProp] !== undefined) {
                        continue; // Does not apply
                    }
                    if (!schema.$extraPropsFilter(extraProp)) {
                        continue; // Ignore
                    }
                    result[extraProp] = sanitizeObject(object[extraProp], schema.$extraPropsSchema(extraProp), (parentStack || []).concat(schema), currentRecursion);
                }
            }

            return result;
        }
    case "recursive":
    {
        if (object === undefined || object === null) {
            return schema.$default;
        }
        const stack = parentStack || [];
        const cr = currentRecursion || 0;
        if (schema.$maxRecursion !== undefined && schema.$maxRecursion < cr) {
            return schema.$default;
        }
        const refSchema = stack[stack.length - schema.$ref];
        if (refSchema) {
            return sanitizeObject(object, refSchema, stack, cr + 1);
        } else {
            throw new Error("Invalid schema: Recursion node points to undefined parent node.");
        }
    }
    case "anyof":
        for (const schemaOption of schema.$schemas) {
            if (matchesSchema(object, schemaOption, false, parentStack, currentRecursion)) {
                return sanitizeObject(object, schemaOption, parentStack, currentRecursion);
            }
        }
        return sanitizeObject(object, schema.$default, parentStack, currentRecursion);
    default:
        return undefined;
    }
}
