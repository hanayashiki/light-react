import { resolveComponentContext } from "./component";
import { areShallowEqual } from "./utils";

type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((s: S) => S);

export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
    const context = resolveComponentContext();
    const slot = context.resolveSlot<S>(() => 
        initialState instanceof Function ? initialState() : initialState
    );

    const setState: Dispatch<SetStateAction<S>> = (s) => {
        if (s !== slot.resolve()) {
            slot.setSlot(s);
            context.rerender!();
        }
    };

    return [
        slot.slot, 
        setState,
    ]
}

export interface MutableRefObject<T> {
    current: T;
}

export function useRef<T>(initialValue: T): MutableRefObject<T> {
    const context = resolveComponentContext();
    const slot = context.resolveSlot(() => ({
        current: initialValue,
    }));

    return slot.slot;
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

export function useEffect(effect: EffectCallback, deps?: DependencyList): void {
    const effectContext = useRef<EffectContext>({
        effect,
        deps,
        firstTime: true,
        shouldRun: true,
    }).current;

    resolveComponentContext().registerEffect(effectContext);

    if (typeof effectContext.deps !== typeof deps || effectContext.deps?.length !== deps?.length) {
        throw new Error(`useEffect get different types of deps. `);
    }

    effectContext.shouldRun = effectContext.firstTime || deps === undefined || !areShallowEqual(effectContext.deps!, deps);
    effectContext.effect = effect;
    effectContext.deps = deps;
    effectContext.firstTime = false;
}

export function useMemo<T>(factory: () => T, deps: DependencyList): T {
    const memoContext = useRef({
        value: undefined as T | undefined,
        firstTime: true,
        factory,
        deps,
    }).current;

    if (memoContext.firstTime || !areShallowEqual(deps, memoContext.deps)) {
        memoContext.value = factory();
    }
    memoContext.deps = deps;
    memoContext.firstTime = false;
    return memoContext.value!;
}