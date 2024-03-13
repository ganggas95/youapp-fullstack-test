interface ShallowIface<T> {
    source: T;
    fields: string[];
    fieldsReplace?: Record<string, any>;
    exceptFields?: string[];
}
export type { ShallowIface };
