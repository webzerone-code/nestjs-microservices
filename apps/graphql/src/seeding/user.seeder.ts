import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('--- SEEDER IS RUNNING ---');
    const userFactory = await factoryManager.get(User);
    // Create 10 fake users in the DB
    await userFactory.saveMany(10);
  }
}
