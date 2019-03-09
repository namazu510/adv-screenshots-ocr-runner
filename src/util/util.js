export function debounce(fn, interval) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, interval)
    }
}
