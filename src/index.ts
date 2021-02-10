import './types/jsx';
import { createAtom, render } from './dom';
import { LightComponent, LightNode } from './types/dom';
import { createComponentElement } from './component';

import {
    useEffect,
    useState,
    useRef,
    useMemo,
} from './hooks';

function createElement<P extends {}>(
    tag: string | LightComponent<P>,
    props?: P,
    ...children: LightNode[]
) {
    if (typeof tag === "string") {
        return createAtom(tag, props, ...children);
    } else {
        return createComponentElement<P>(tag, props ?? {} as P, ...children);
    }
}

const React = {
    createElement,
    render
}

export {
    React,
    useEffect,
    useState,
    useRef,
    useMemo,
};

export default React;