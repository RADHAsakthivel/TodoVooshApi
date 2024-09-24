import { DataSource } from 'typeorm';
import { User } from './modules/user';
import { Task } from './modules';

export async function intializeDatabase(dbUrl:string):Promise<DataSource>{
    const AppDataSource:DataSource = new DataSource({
        type: 'postgres',
        url: dbUrl,
        entities: [Task],
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