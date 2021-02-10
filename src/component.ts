import { diffAndPatch } from "./dom";
import { LightComponent, LightComponentElement, LightNode } from "./types/dom";

let currentContext: ComponentContext<{}> | undefined = undefined;

export type Task = {
    type: 'rerender',
}

export type EffectCallback = () => (void | (() => void | undefined));
export type DependencyList = ReadonlyArray<any>;
export interface EffectContext {
    cleanUp?: () => void;
    effect: EffectCallback;
    deps?: DependencyList;
    firstTime: boolean;
    shouldRun: boolean;
}

export interface EffectContext {
    cleanUp?: () => void;
    effect: EffectCallback;
    deps?: DependencyList;
    firstTime: boolean;
    shouldRun: boolean;
}

export interface Slot<T> { 
    slot: T, 
    setSlot: (s: T | ((s: T) => T)) => void,
    resolve: () => T;
}
export interface ComponentContext<P extends {}> {
    componentElement?: LightComponentElement<P> ;
    firstRender: boolean;
    nthSlot: number;
    slots: any[];
    rerender?: () => void;
    resolveSlot: <T>(valueCreateor: () => T) => Slot<T>;
    effects: EffectContext[];
    registerEffect: (effect: EffectContext) => void;
    runEffects: () => void;
    cleanUp: () => void;
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
        nthSlot: 0,
        slots: [],
        effects: [],
        resolveSlot: function resolveSlot<T>(valueCreator: () => T) {
            const nthSlot = this.nthSlot;

            if (this.firstRender) {
                const state = valueCreator();
                this.slots.push(state);
            }
            const slot = this.slots[nthSlot];
            const setSlot = (s: T | ((s: T) => T)) => {
                this.slots[nthSlot] = s instanceof Function ? s(this.slots[nthSlot]) : s;
            }
            const resolve = () => this.slots[nthSlot];

            this.nthSlot++;
            return {
                slot,
                setSlot,
                resolve,
            }
        },
        registerEffect(effect: EffectContext) {
            if (this.firstRender) {
                this.effects.push(effect);
            }
        },
        runEffects() {
            // console.log(this.componentElement?.component.name, "runEffects", this.effects);
            for (const effect of this.effects) {
                if (effect.shouldRun) {
                    const cleanUp = effect.effect();
                    if (cleanUp) {
                        effect.cleanUp = cleanUp;
                    }
                }
            }
        },
        cleanUp() {
            // console.log(this.componentElement?.component.name, "cleanUp", this.effects);
            for (const effect of this.effects) {
                if (effect.cleanUp) {
                    effect.cleanUp();
                }
            }
        }
    }

    return {
        tag: '',
        type: 'LightComponentElement',
        component,
        props: props,
        children,
        context,
        shallowRender() {
            const prevContext = currentContext;
            currentContext = context as any;
            context.componentElement = this;
            context.rerender = () => {
                const prevVDOM = this.resultVDOM;
                this.shallowRender();
                const nextVDOM = this.resultVDOM;
                diffAndPatch(prevVDOM, nextVDOM, this._DOM?.parentElement as Element);
                this.context.runEffects();
            }
            try {
                this.resultVDOM = this.component(this.props);
                context.nthSlot = 0;
                context.firstRender = false;
            } finally {
                currentContext = prevContext;
            }
        }
    };
}