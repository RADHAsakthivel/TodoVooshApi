export function Controller() {
    return (target: Function) => {
      Reflect.defineMetadata('design:paramtypes', Reflect.getMetadata('design:paramtypes', target), target);
    };
  }