import { diff } from "./diff";
import { diffAndPatch, render } from "./dom";
import React from "./index";
import { GenericDOM, LightAtom, LightComponent, LightComponentElement, LightNode, Patch } from "./types/dom";
import { isLightAtom, isLightText } from "./utils";

let currentContext: ComponentContext<{}> | undefined = undefined;

export type Task = {
    type: 'rerender',
}
export interface ComponentContext<P extends {}> {
    componentElement?: LightComponentElement<P> ;
    firstRender: boolean;
    nthState: number;
    states: any[];
    rerender?: () => void;
}

export const resolveComponentContext = () => {
    if (currentContext === undefined) {
        throw new Error("Should not call hooks outside of functional components. ");
    }
    return currentContext;
}

export const createComponentElement = <P extends {}>(
    component: LightComponent<P>,
    props: P,
    ...children: LightNode[]
): LightComponentElement<P> => {
    const context: ComponentContext<P> = {
        firstRender: true,
        nthState: 0,
        states: [],
    }

    return {
        tag: '',
        type: 'LightComponentElement',
        component,
        props: props,
        children,
        shallowRender() {
            const prevContext = currentContext;
            currentContext = context as any;
            context.componentElement = this;
            context.rerender = () => {
                const prevVDOM = this.resultVDOM;
                this.shallowRender();
                const nextVDOM = this.resultVDOM;
                diffAndPatch(prevVDOM, nextVDOM, this._DOM?.parentElement as Element);
            }
            try {
                this.resultVDOM = this.component(this.props);

                console.log(currentContext);

                context.nthState = 0;
                context.firstRender = false;

            } finally {
                currentContext = prevContext;
            }
        }
    };
}