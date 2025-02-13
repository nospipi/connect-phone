import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { getUsers } from 'database';
import { User } from 'database';
//https://stackoverflow.com/a/75356810

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const users = await getUsers();
    const names = users.map((user: User) => user.name).join('<br>');

    return `Hello World!<br><br>${currentDate}<br><br>${names}`;
  }
}
