// Match function, checks if an object
// matches certain schema

"use strict";

import { RawObjectSchema } from "./schema-raw";

/**
 * This function tests if an object matches the schema. 
 * If it returns true, it means the value can be assigned.
 * If false, if means it requires conversion or fallback to the default value. 
 * @param object The object to test, any type
 * @param schema The shema to use
 */
export function matchesSchema(object: any, schema: RawObjectSchema, throwException?: boolean, parentStack?: RawObjectSchema[], currentRecursion?: number): boolean {
    switch (schema.$type) {
    case "null":
        if (object !== null) {
            if (throwException) {
                throw new Error("Object not null: " + object);
            }
            return false;
        }
        return true;
    case "undefined":
        if (object !== undefined) {
            if (throwException) {
                throw new Error("Object not undefined: " + object);
            }
            return false;
        }
        return true;
    case "custom":
    {
        const customTestRes = schema.$test(object);
        if (throwException) {
            throw new Error("Custom test rejected object: " + object);
        }
        return customTestRes;
    }
    case "string":
        if (typeof object !== "string") {
            if (throwException) {
                throw new Error("Not string type: " + object);
            }
            return false; // Not string
        }
        if (schema.$maxLength !== undefined && schema.$maxLength < object.length) {
            if (throwException) {
                throw new Error("String exceeds max length: " + object);
            }
            return false; // Too long
        }
        if (schema.$match !== undefined && !schema.$match.test(object)) {
            if (throwException) {
                throw new Error("String does not match regular expession: " + object);
            }
            return false; // Does not match regexp
        }
        if (schema.$enum !== undefined && !schema.$enum.includes(object)) {
            if (throwException) {
                throw new Error("String is not in the enumeration: " + object);
            }
            return false; // Not in enum
        }
        return true;
    case "number":
        if (typeof object !== "number") {
            if (throwException) {
                throw new Error("Not number type: " + object);
            }
            return false; // Not number
        }
        if (schema.$nan !== undefined && !schema.$nan && isNaN(object)) {
            if (throwException) {
                throw new Error("NaN not allowed: " + object);
            }
            return false; // NaN not allowed
        }
        if (schema.$finite !== undefined && schema.$finite && !isFinite(object)) {
            if (throwException) {
                throw new Error("Infinity not allowed: " + object);
            }
            return false; // Infinite not allowed
        }
        if (schema.$format !== undefined && schema.$format === "integer" && Math.floor(object) !== object) {
            if (throwException) {
                throw new Error("Number has decimal digits, but schema forces integer: " + object);
            }
            return false; // Schema requires integer, but it's a decimal number
        }
        if (schema.$min !== undefined && object < schema.$min) {
            if (throwException) {
                throw new Error("Number is lower than min value set: " + object);
            }
            return false; // Lower than min value
        }
        if (schema.$max !== undefined && object > schema.$max) {
            if (throwException) {
                throw new Error("Number is greater than max value set: " + object);
            }
            return false; // Greater than max value
        }
        if (schema.$enum !== undefined && !schema.$enum.includes(object)) {
            if (throwException) {
                throw new Error("Number is not in the enumeration: " + object);
            }
            return false; // Not in enum
        }
        return true;
    case "boolean":
        if (typeof object !== "boolean") {
            if (throwException) {
                throw new Error("Not boolean type: " + object);
            }
            return false; // Not boolean
        }
        if (schema.$enum !== undefined && !schema.$enum.includes(object)) {
            if (throwException) {
                throw new Error("Boolean not in the enumeration: " + object);
            }
            return false; // Not in enum
        }
        return true;
    case "array":
        if (!(object instanceof Array)) {
            if (throwException) {
                throw new Error("Not an array: " + object);
            }
            return false; // Not array
        }
        if (schema.$maxLength !== undefined && schema.$maxLength < object.length) {
            if (throwException) {
                throw new Error("Too many items: " + object);
            }
            return false; // Too many items
        }
        for (const item of object) {
            try {
                if (!matchesSchema(item, schema.$items, throwException, (parentStack || []).concat(schema), currentRecursion)) {
                    return false; // One of the items does not match the schema
                }
            } catch (ex) {
                throw new Error("[Array] For item [" + object.indexOf(item) + "]: " + ex.message);
            }
        }
        return true;
    case "object":
        if (typeof object !== "object" || object === null) {
            if (throwException) {
                throw new Error("Not an object: " + object);
            }
            return false; // Not a valid object
        }
        if (schema.$props !== undefined) {
            // Required props
            for (const prop of Object.keys(schema.$props)) {
                const child = object[prop];
                const childSchema = schema.$props[prop];
                try {
                    if (!matchesSchema(child, childSchema, throwException, (parentStack || []).concat(schema), currentRecursion)) {
                        return false; // One of the properties is invalid
                    }
                } catch (ex) {
                    throw new Error("[Object] For property [" + prop + "]: " + ex.message);
                }
            }
        }
        if (schema.$extraPropsFilter !== undefined && schema.$extraPropsSchema !== undefined) {
            for (const extraProp of Object.keys(object)) {
                if (schema.$props !== undefined && schema.$props[extraProp] !== undefined) {
                    continue; // Does not apply
                }
                if (!schema.$extraPropsFilter(extraProp)) {
                    if (throwException) {
                        throw new Error("Invalid property: " + extraProp);
                    }
                    return false; // Invalid prop
                }
                try {
                    if (!matchesSchema(object[extraProp], schema.$extraPropsSchema(extraProp), throwException, (parentStack || []).concat(schema), currentRecursion)) {
                        return false; // Does not match schema
                    }
                } catch (ex) {
                    throw new Error("[Object] For property [" + extraProp + "]: " + ex.message);
                }
            }
        }
        return true;
    case "recursive":
        {
            const stack = parentStack || [];
            const cr = currentRecursion || 0;
            if (schema.$maxRecursion !== undefined && schema.$maxRecursion <= cr) {
                if (throwException) {
                    throw new Error("Exceeded recursion limit.");
                }
                return false; // Too much recursion
            }
            const refSchema = stack[stack.length - schema.$ref];
            if (refSchema) {
                if (!matchesSchema(object, refSchema, throwException, stack, cr + 1)) {
                    return false; // Does not match schema
                }
            } else {
                throw new Error("Invalid schema: Recursion node points to undefined parent node.");
            }
        }
        return true;
    case "anyof":
        for (const schemaOption of schema.$schemas) {
            if (matchesSchema(object, schemaOption, false, parentStack, currentRecursion)) {
                return true; // Matches one of the schemas
            }
        }
        if (throwException) {
            throw new Error("Object does not match any of the provided schemas: " + object);
        }
        return false;
    default:
        return false;
    }
}
