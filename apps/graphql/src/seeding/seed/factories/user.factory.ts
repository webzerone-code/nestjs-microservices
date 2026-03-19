import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../../entities/user.entity';
import { Role } from '../../../enums/role.enum';

export default setSeederFactory(User, (faker) => {
  const user = new User();
  user.first_name = faker.person.firstName();
  user.last_name = faker.person.lastName();
  user.username = faker.internet.username();
  user.password = faker.internet.password();
  user.email = faker.internet.email();
  user.role = Role.USER;
  return user;
});
