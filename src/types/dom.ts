export type LightNode = LightComponentElement | LightText | LightAtom | string | undefined;

export interface LightAtom<Props = {}> {
    tag: string;
    type: 'LightAtom';
    _DOM?: GenericDOM;
    props: Props;
    children: LightNode[];
}

export interface LightText {
    tag: '';
    type: 'LightText';
    text: string;
    _DOM?: GenericDOM;
}

// Created by component
export interface LightComponentElement<Props = {}> {
    tag: '',
    type: 'LightComponentElement',
    component: LightComponent<Props>;
    props: Props;
    children: LightNode[];
    _DOM?: GenericDOM;
    resultVDOM?: LightNode;
    shallowRender: () => void;
}

export interface LightComponent<Props = {}> {
    name: string;
    (props: Props): LightNode;
}

declare global {
    interface Element {
        _VDOM?: LightNode;
    }

    interface Text {
        _VDOM?: LightNode;
    }
} 

export type GenericDOM = Element | Text;

export type Patch = | 
    {
        type: 'create',
        prevVDOM: LightNode,
        nextVDOM: LightNode,
        parentDOM: GenericDOM,
    } | 
    {
        type: 'delete',
        prevVDOM: LightNode,
        nextVDOM: LightNode,
        parentDOM: GenericDOM,
    } |
    {
        type: 'updateProps',
        DOM: GenericDOM,
        key: string,
        value: string,
    } |
    {
        type: 'update',
        prevVDOM: LightNode,
        nextVDOM: LightNode,
        parentDOM: GenericDOM,
    }