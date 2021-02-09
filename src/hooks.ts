import { resolveComponentContext } from "./component";

type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S;

export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
    const context = resolveComponentContext();
    const nthState = context.nthState;

    if (context.firstRender) {
        const state = initialState instanceof Function ? initialState() : initialState;
        context.states.push(state);
    }

    const setState: Dispatch<S> = (s: S) => {
        if (s !== context.states[nthState]) {
            context.states[nthState] = s;
            context.rerender!();
        }
    };

    context.nthState++;

    return [
        context.states[nthState],
        setState,
    ]

}