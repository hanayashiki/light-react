import { LightAtom, LightComponentElement, LightText } from "./types/dom";

export const isFalsy = (x: any) => [undefined, null, false].includes(x);

export function isLightAtom(target: any): target is LightAtom {
    return target?.type?.startsWith?.('LightAtom') ?? false;
}

export function isLightText(target: any): target is LightText {
    return target?.type === "LightText";
}

export function isLightComponentElement(target: any): target is LightComponentElement {
    return target?.type === "LightComponentElement";
}

export function areShallowEqual(a: object, b: object) {
    if (Object.keys(a).length !== Object.keys(b).length) {
        return false;
    }
    for (const [key, val] of Object.entries(a)) {
        if ((b as any)[key] !== val) {
            return false;
        }
    }
    return true;
}