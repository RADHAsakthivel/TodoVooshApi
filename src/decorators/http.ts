import "reflect-metadata";
import { Request, Response } from "express";

function createRouteDecorator(method: string, path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata("route:method", method, target, propertyKey);
        Reflect.defineMetadata("route:path", path, target, propertyKey);
    };
}

export function Get(path:string){
    return createRouteDecorator("get",path);
}

export function Post(path:string){
    return createRouteDecorator("post",path);
}

export function Put(path:string){
    return createRouteDecorator("put",path);
}

export function Patch(path:string){
    return createRouteDecorator("patch",path);
}

export function Delete(path:string){
    return createRouteDecorator("delete",path);
}