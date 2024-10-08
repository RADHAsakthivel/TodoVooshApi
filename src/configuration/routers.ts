import express from "express";
import { Request, Response,NextFunction } from "express";
import "reflect-metadata";
import { authGuard } from "../shared/guard/authGuard";

type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";

/**
 * @private app expressApp
 * @private serviceContainer HashMap service class
 * @param expressApp express app to set the router and controller
 * @param service Hashmap of serviceClass to inject in controller class
 * @method bindRoutes registor the routes for all controller method
 */
export class Route {
  private app: express.Express;
  private serviceContainer: Map<string, any>;

  constructor(expressApp: express.Express, services: Map<string, any>) {
    this.app = expressApp;
    this.serviceContainer = services;
  }

  /**
   * 
   * @param controllerClass Take the controller class
   * @description will intialize the controller class inject all dependency and  registor routes in express app
   */
  bindRoutes(controllerClass: any):void {
    const constructorParams = Reflect.getMetadata('design:paramtypes', controllerClass);
    let controller = new controllerClass();

    if (constructorParams) {
      const services = constructorParams.map((paramType: any) => {
        const serviceName = paramType.name;
        return this.serviceContainer.get(serviceName);
      });
      controller = new controllerClass(...services);
    }

    const methods = Object.getOwnPropertyNames(
      controller.constructor.prototype
    );
    
    methods.forEach((method) => {
      if (method === "constructor") return;

      const routeMethod = Reflect.getMetadata(
        "route:method",
        controller.constructor.prototype,
        method
      ) as HttpMethod;
      const routePath = Reflect.getMetadata(
        "route:path",
        controller.constructor.prototype,
        method
      );
      const isAuthRequire = Reflect.getMetadata(
        "route:authRequired",
        controller.constructor.prototype,
        method
      );

      if (routeMethod && routePath) {
        console.log(`Binding route: ${routeMethod} ${routePath}`);
        const handler = (req: Request, res: Response,next: NextFunction) => {
          try{
            controller[method](req, res);
          }catch(error:any){
            console.log("error =>",error);
            return res.status(500).send("Internal server error")
          }
        };
        console.log("auth =>",routePath,isAuthRequire)
        if(isAuthRequire)this.app[routeMethod](routePath,authGuard,handler);
        else this.app[routeMethod](routePath, handler);
      }
    });
  }
}