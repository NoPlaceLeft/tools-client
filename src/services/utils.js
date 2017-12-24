export function timeout(fn, time = 0) {
    const timeoutId = setTimeout(() => {
        fn();
        clearTimeout(timeoutId);
    }, time);
}