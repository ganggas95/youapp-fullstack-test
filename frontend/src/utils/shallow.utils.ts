import type { ShallowIface } from "@/interfaces/shallow.iface";

export const deepCopy = <T>(data: T): T => {
    return JSON.parse(JSON.stringify(data));
};

export function shallow<T extends object>({
    source,
    fields,
    fieldsReplace,
    exceptFields,
}: ShallowIface<T>): T {
    const copy = {} as T | any;
    for (const key in source) {
        if (fields.includes(key) && !exceptFields?.includes(key)) {
            if (fieldsReplace && fieldsReplace[key]) {
                // We change the key to the new one
                copy[fieldsReplace[key]] = source[key];
            } else {
                copy[key] = source[key];
            }
        }
    }
    return deepCopy<T>(copy);
}
