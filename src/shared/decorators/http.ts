import "reflect-metadata";
import { Request, Response } from "express";

function createRouteDecorator(
  method: string,
  path: string,
  isAuthRequire: boolean
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata("route:method", method, target, propertyKey);
    Reflect.defineMetadata("route:path", path, target, propertyKey);
    Reflect.defineMetadata(
      "route:authRequired",
      isAuthRequire,
      target,
      propertyKey
    );
  };
}

export function Get(path: string, authRequired?: boolean) {
  return createRouteDecorator(
    "get",
    path,
    authRequired != null || authRequired != undefined ? authRequired : true
  );
}

export function Post(path: string, authRequired?: boolean) {
  return createRouteDecorator(
    "post",
    path,
    authRequired != null || authRequired != undefined ? authRequired : true
  );
}

export function Put(path: string, authRequired?: boolean) {
  return createRouteDecorator(
    "put",
    path,
    authRequired != null || authRequired != undefined ? authRequired : true
  );
}

export function Patch(path: string, authRequired?: boolean) {
  return createRouteDecorator(
    "patch",
    path,
    authRequired != null || authRequired != undefined ? authRequired : true
  );
}

export function Delete(path: string, authRequired?: boolean) {
  return createRouteDecorator(
    "delete",
    path,
    authRequired != null || authRequired != undefined ? authRequired : true
  );
}
