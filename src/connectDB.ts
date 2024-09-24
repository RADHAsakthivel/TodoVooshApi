import { DataSource } from 'typeorm';
import { Task,User } from './modules';

/**
 * 
 * @param dbUrl PSQL connection string
 * @returns AppDataSource typeorm SQL context to do CRUD operation in service layer
 */
export async function intializeDatabase(dbUrl:string):Promise<DataSource>{
    const AppDataSource:DataSource = new DataSource({
        type: 'postgres',
        url: dbUrl,
        entities: [Task,User],
        logging: true,
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        }
      });

    await AppDataSource.initialize()
            .then(()=>{
                console.info("Data Source has been initialized!");
            })
            .catch((error)=>{
                console.error("Not able to  initialized Data Source!",error);
            })
    return AppDataSource;
}