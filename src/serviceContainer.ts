import { DataSource } from "typeorm";

/**
 * @readonly serviceContainer will store name of service class and it's object
 * @private dbContext postgreql dbcontext inject in every service class
 */
export class ServiceBuilder {
    readonly serviceContainer: Map<string, any>;
    private dbContext: DataSource;
  
    constructor(dbSource: DataSource) {
      this.serviceContainer = new Map();
      this.dbContext = dbSource;
    }
  /**
   * 
   * @param serviceClass intialize the service class and inject dbContext
   * @returns void
   */
    initializeService<T>(serviceClass: new (dbContext: DataSource) => T): void {
      const service = new serviceClass(this.dbContext);
      this.serviceContainer.set(serviceClass.name, service);
    }
  
    /**
     * 
     * @returns Map<string, any> serviceContainer
     */
    getServiceContainer(): Map<string, any> {
      return this.serviceContainer;
    }
  }