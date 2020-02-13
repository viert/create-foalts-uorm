export function runSoon(
  _target: any,
  _propertyName: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;
  if (original.constructor.name === "AsyncFunction") {
    descriptor.value = function(...args: any[]) {
      setImmediate(async () => {
        await original(...args);
      });
    };
  } else {
    descriptor.value = function(...args: any[]) {
      setImmediate(() => {
        original(...args);
      });
    };
  }
}
