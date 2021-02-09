import { GenericDOM, LightAtom, LightNode, Patch } from "./types/dom";
import { areShallowEqual, isFalsy, isLightAtom, isLightComponentElement, isLightText } from "./utils";

export const diff = (prevVDOM: LightNode, nextVDOM: LightNode, parentDOM: GenericDOM): Patch[] => {
    const patches: Patch[] = [];

    if (isFalsy(prevVDOM)) {
        patches.push({
            type: 'create',
            prevVDOM,
            nextVDOM,
            parentDOM,
        });
    } else if (isFalsy(nextVDOM)) {
        patches.push({
            type: 'delete',
            prevVDOM,
            nextVDOM,
            parentDOM,
        })
    } else if (isLightAtom(prevVDOM) && isLightAtom(nextVDOM)) {
        if (prevVDOM.tag === nextVDOM.tag) {
            patches.push(...diffProps(prevVDOM, nextVDOM));

            const maxLen = Math.max(prevVDOM.children.length, nextVDOM.children.length);
            for (let i = 0; i < maxLen; i++) {
                const childA = prevVDOM.children[i] || undefined;
                const childB = nextVDOM.children[i] || undefined;
                patches.push(...diff(childA, childB, prevVDOM._DOM!));
            }
        } else {
            patches.push({
                type: 'update',
                prevVDOM,
                nextVDOM,
                parentDOM,
            });
        }
    } else if (isLightText(prevVDOM) && isLightText(nextVDOM)) {
        if (prevVDOM.toString() !== nextVDOM.toString()) {
            patches.push({ type: 'update', prevVDOM, nextVDOM, parentDOM })
        }
    } else if (isLightComponentElement(prevVDOM) && isLightComponentElement(nextVDOM)) {
        if (prevVDOM.component !== nextVDOM.component) {
            patches.push({ type: 'update', prevVDOM, nextVDOM, parentDOM });
        } else if (!areShallowEqual(prevVDOM.props, nextVDOM.props)) {
            const nextResultVDOM = nextVDOM.component(nextVDOM.props);
            nextVDOM.resultVDOM = nextResultVDOM;
            patches.push(...diff(prevVDOM.resultVDOM, nextVDOM.resultVDOM, prevVDOM._DOM!));
        } // Else the VDOM will not be updated
    } else if (prevVDOM !== nextVDOM) {
        patches.push({ type: 'update', prevVDOM, nextVDOM, parentDOM });
    } else {
        console.error("Unknown parameters", { prevVDOM, nextVDOM })
        throw new Error("Unknown parameters");
    }
    return patches;
}

export const diffProps = (prevVDOM: LightAtom, nextVDOM: LightAtom) => {
    const patches: Patch[] = [];
    for (const [key, value] of Object.entries(nextVDOM.props)) {
        patches.push({
            type: 'updateProps',
            DOM: prevVDOM._DOM!,
            key,
            value: value as any,
        })
    }

    for (const [key] of Object.entries(prevVDOM.props)) {
        if (!(key in nextVDOM.props)) {
            patches.push({
                type: 'updateProps',
                DOM: prevVDOM._DOM!,
                key,
                value: "",
            })
        }
    }
    return patches;
}