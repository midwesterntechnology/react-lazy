import { Fragment, useEffect, useState } from "react"
import { LazyOptions } from "."

/**
 * Return true after a delay.
 */
export function useDelayed(ms: number) {
    const [ready, setReady] = useState(ms === 0)
    useEffect(() => {
        if (ms > 0) {
            if (ready) {
                setReady(false)
            }
            const timer = setTimeout(() => setReady(true), ms)
            return () => {
                clearTimeout(timer)
            }
        }
    }, [ms])
    return ready
}

/**
 * A value or a function that produces one.
 */
export type ValueOrFactory<T, A extends readonly unknown[] = []> = T | ((...arg: A) => T)

/**
 * If a value is a function, call it. Otherwise return it.
 */
export function callOrGet<T, A extends readonly unknown[]>(value: ValueOrFactory<T, A>, ...args: A) {
    if (value instanceof Function) {
        return value(...args)
    }
    return value
}

/**
 * The default lazy options.
 */
export const defaultLazyOptions: LazyOptions = {
    onLoading: () => <Fragment />,
    onReloading: props => <Fragment children={props.children} />,
    onError: props => { throw props.error },
    showLoading: true,
    showReloading: true,
    distinguishReloading: true,
    loadingTitle: undefined,
    reloadingTitle: undefined,
    loadingDelay: 10,
    reloadingDelay: 0,
}

/**
 * Turns lazy options into options using props.
 */
export function processLazyOptions<T>(options: LazyOptions<T>, pass: T) {
    return {
        onLoading: options.onLoading,
        onReloading: options.onReloading,
        onError: options.onError,
        distinguishReloading: callOrGet(options.distinguishReloading, pass),
        showLoading: callOrGet(options.showLoading, pass),
        showReloading: callOrGet(options.showReloading, pass),
        loadingTitle: callOrGet(options.loadingTitle, pass),
        reloadingTitle: callOrGet(options.reloadingTitle, pass),
        loadingDelay: callOrGet(options.loadingDelay, pass),
        reloadingDelay: callOrGet(options.reloadingDelay, pass),
    }
}
