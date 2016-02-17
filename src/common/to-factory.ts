///<reference path="../ref.d.ts"/>

export default function toFactory(constructorFn:Function) {
    const factory = (...args:any[]) => {
        const instance = Object.create(constructorFn.prototype);
        constructorFn.apply(instance, args);
        return instance;
    };
    factory.$inject = constructorFn.$inject;
    return factory;
}
