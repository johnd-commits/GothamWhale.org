const frameIds = new Map<number, ReturnType<typeof setTimeout>>();
let nextFrameId = 0;

if (typeof globalThis.requestAnimationFrame !== 'function') {
  globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
    const frameId = nextFrameId + 1;
    nextFrameId = frameId;
    const timeout = setTimeout(() => {
      frameIds.delete(frameId);
      callback(Date.now());
    }, 0);
    frameIds.set(frameId, timeout);
    return frameId;
  };
}

if (typeof globalThis.cancelAnimationFrame !== 'function') {
  globalThis.cancelAnimationFrame = (frameId: number | null | undefined) => {
    if (frameId == null) {
      return;
    }
    const timeout = frameIds.get(frameId);
    if (timeout !== undefined) {
      clearTimeout(timeout);
      frameIds.delete(frameId);
    }
  };
}
