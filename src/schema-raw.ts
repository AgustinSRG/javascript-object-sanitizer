// Raw schema
// Typings for object schema

"use strict";

export interface CustomSanitizeSchema {
    $type: "custom";
    $test: (object: any) => boolean;
    $sanitize: (object: any) => any;
}

export interface BooleanSchema {
    $type: "boolean";
    $default?: boolean;
    $enum?: boolean[];
}

export interface StringSchema {
    $type: "string";
    $default?: string;
    $maxLength?: number;
    $match?: RegExp;
    $enum?: string[];
}

export interface NumberSchema {
    $type: "number";
    $default?: number;
    $format?: "double" | "integer";
    $min?: number;
    $max?: number;
    $finite?: boolean;
    $nan?: boolean;
    $enum?: number[];
}

export interface ArraySchema {
    $type: "array";
    $default?: any[];
    $maxLength?: number;
    $items: RawObjectSchema;
}

export interface ObjectSchema {
    $type: "object";
    $default?: any;
    $props?: {[prop: string]: RawObjectSchema};
    $extraPropsFilter?: (key: string) => boolean;
    $extraPropsSchema?: (key: string) => RawObjectSchema;
}

export interface AnyOfSchema {
    $type: "anyof";
    $default: RawObjectSchema;
    $schemas: RawObjectSchema[];
}

export interface RecursiveSchema {
    $type: "recursive";
    $default?: any;
    $ref: number;
    $maxRecursion?: number;
}

export interface NullOrUndefinedSchema {
    $type: "null" | "undefined";
}

export type RawObjectSchema = CustomSanitizeSchema | NullOrUndefinedSchema | BooleanSchema | StringSchema | NumberSchema | ArraySchema | ObjectSchema | RecursiveSchema | AnyOfSchema;
