// Raw schema
// Typings for object schema

"use strict";

export interface CustomSanitizeRawSchema {
    $type: "custom";
    $test: (object: any) => boolean;
    $sanitize: (object: any) => any;
}

export interface BooleanRawSchema {
    $type: "boolean";
    $default?: boolean;
    $enum?: boolean[];
}

export interface StringRawSchema {
    $type: "string";
    $default?: string;
    $maxLength?: number;
    $match?: RegExp;
    $enum?: string[];
}

export interface NumberRawSchema {
    $type: "number";
    $default?: number;
    $format?: "double" | "integer";
    $min?: number;
    $max?: number;
    $finite?: boolean;
    $nan?: boolean;
    $enum?: number[];
}

export interface ArrayRawSchema {
    $type: "array";
    $default?: any[];
    $maxLength?: number;
    $items: RawObjectSchema;
}

export interface ObjectRawSchema {
    $type: "object";
    $props?: {[prop: string]: RawObjectSchema};
    $extraPropsFilter?: (key: string) => boolean;
    $extraPropsSchema?: (key: string) => RawObjectSchema;
}

export interface AnyOfRawSchema {
    $type: "anyof";
    $default: RawObjectSchema;
    $schemas: RawObjectSchema[];
}

export interface RecursiveRawSchema {
    $type: "recursive";
    $ref: number;
    $maxRecursion?: number;
}

export interface NullOrUndefinedRawSchema {
    $type: "null" | "undefined";
}

export type RawObjectSchema = CustomSanitizeRawSchema | NullOrUndefinedRawSchema | BooleanRawSchema | StringRawSchema | NumberRawSchema | ArrayRawSchema | ObjectRawSchema | RecursiveRawSchema | AnyOfRawSchema;
