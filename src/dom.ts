import { diff } from "./diff";
import { GenericDOM, LightAtom, LightNode, Patch } from "./types/dom";
import { isLightAtom, isLightComponentElement, isLightText } from "./utils";

export const createAtom = <P extends {}>(
    tag: string,
    props?: P,
    ...children: LightNode[]
): LightAtom => {
    return {
        tag,
        type: 'LightAtom',
        props: props ?? {},
        children: children.map(child => {
            if (typeof child === "string") {
                return {
                    tag: '',
                    type: 'LightText',
                    text: child,
                }
            } else if (typeof child === "number") {
                return {
                    tag: '',
                    type: 'LightText',
                    text: `${child}`,
                }
            }
            else {
                return child;
            }
        }),
    }
}

export const render = (nextVDOM: LightNode, rootDOM: Element | null) => {
    // console.log("render", nextVDOM, rootDOM);
    if (rootDOM === null) {
        return;
    }

    const prevVDOM = rootDOM._VDOM;
    rootDOM._VDOM = nextVDOM;
    diffAndPatch(prevVDOM, nextVDOM, rootDOM);
}

export const diffAndPatch = (prevVDOM: LightNode, nextVDOM: LightNode, parentDOM: Element) => {
    const patches: Patch[] = diff(prevVDOM, nextVDOM, parentDOM);
    patch(patches);
    // console.log(patches);
    return patches;
}

export const patch = (patches: Patch[]) => {
    patches.forEach(patch => {
        if (patch.type === 'create') {
            const { nextVDOM, parentDOM } = patch;
            const dom = createDOM(nextVDOM);
            parentDOM.appendChild(dom);
            
            if (isLightComponentElement(nextVDOM)) {
                nextVDOM.context.runEffects();
            }
        } else if (patch.type === 'delete') {
            const { prevVDOM, parentDOM } = patch;
            if (isLightAtom(prevVDOM) || isLightComponentElement(prevVDOM)) {
                const dom = prevVDOM._DOM;
                if (dom) {
                    parentDOM.removeChild(dom);
                }
            }

            if (isLightComponentElement(prevVDOM)) {
                prevVDOM.context.cleanUp();
            }
        } else if (patch.type === 'updateProps') {
            const { DOM, key, value } = patch;
            if (DOM instanceof HTMLElement) {
                DOM.setAttribute(key, value);
            } else {
                console.error(`Trying to set ${key} = ${value} on`, DOM);
                throw new Error("Cannot update props on a non-HTMLElement")
            }
        } else if (patch.type === 'update') {
            const { prevVDOM, nextVDOM, parentDOM } = patch;
            const dom = createDOM(nextVDOM);
            parentDOM.replaceChild(dom, (prevVDOM as LightAtom)._DOM!);
        }
    })
}

function createDOM(vdom: LightNode): GenericDOM {
    let dom: GenericDOM | undefined = undefined;
    if (isLightAtom(vdom)) {
        let { tag, props = {}, children = [] } = vdom;
        let _dom = document.createElement(tag);
        (children || []).forEach(child => {
            _dom.appendChild(createDOM(child))
        })

        Object.keys(props || []).forEach(key => {
            _dom.setAttribute(key, (props as any)[key]);
        })
        dom = _dom;
        vdom._DOM = dom;
    } else if (isLightText(vdom)) {
        dom = document.createTextNode(vdom.text);
        vdom._DOM = dom;
    } else if (isLightComponentElement(vdom)) {
        vdom.shallowRender();
        dom = createDOM(vdom.resultVDOM);
        vdom._DOM = dom;
    }

    return dom as GenericDOM;
}