import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { getUsers } from 'database';
import { User } from 'database';
//https://stackoverflow.com/a/75356810

@Injectable()
export class AppService {
  getHello = async (): Promise<string> => {
    const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const users = await getUsers();
    const names = users.map((user: User) => user.name).join('<br>');

    return `Hello World!<br><br>${currentDate}${names && `<br><br>${names}`}`;
  };
}
