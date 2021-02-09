import { diff } from "./diff";
import { GenericDOM, LightAtom, LightComponent, LightComponentElement, LightNode, Patch } from "./types/dom";
import { isLightAtom, isLightText } from "./utils";

export const createComponentElement = <P extends {}>(
    component: LightComponent<P>,
    props: P,
    ...children: LightNode[]
): LightComponentElement<P> => {
    return {
        tag: '',
        type: 'LightComponentElement',
        component,
        props: props,
        children,
        shallowRender() {
            this.resultVDOM = this.component(this.props);
        }
    };
}