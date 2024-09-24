import { DataSource } from "typeorm";

export class ServiceBuilder {
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