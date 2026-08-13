// Tiny toast emitter — kept separate from components so component files
// stay fast-refresh-clean.

let listeners = [];

export function toast(message, icon) {
  listeners.forEach((fn) => fn({ id: Date.now() + Math.random(), message, icon }));
}

export function subscribeToasts(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((x) => x !== fn);
  };
}
