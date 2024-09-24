import express from "express";
import { Request, Response } from "express";
import "reflect-metadata";
import { DataSource } from "typeorm";

type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";

type ConstructorArguments<T> = T extends new (...args: infer U) => any
  ? U
  : any;

export class Route {
  private app: express.Express;
  private serviceContainer: Map<string, any>;

  constructor(express: express.Express, services: Map<string, any>) {
    this.app = express;
    this.serviceContainer = services;
  }

  bindRoutes(controllerClass: any) {
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

      if (routeMethod && routePath) {
        console.log(`Binding route: ${routeMethod} ${routePath}`);
        const handler = (req: Request, res: Response) => {
          try {
            controller[method](req, res);
          } catch (error: any) {
            console.error("Error handling route:", error);
            res.status(500).send("Internal Server Error");
          }
        };

        this.app[routeMethod](routePath, handler);
      }
    });
  }
}

export class Service {
  readonly serviceContainer: Map<string, any>;
  private dbContext: DataSource;

  constructor(dbSource: DataSource) {
    this.serviceContainer = new Map();
    this.dbContext = dbSource;
  }

  initializeService<T>(serviceClass: new (dbContext: DataSource) => T): void {
    const service = new serviceClass(this.dbContext);
    this.serviceContainer.set(serviceClass.name, service);
  }

  getServiceContainer(): Map<string, any> {
    return this.serviceContainer;
  }
}
