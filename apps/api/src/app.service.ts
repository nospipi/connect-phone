// import { Injectable } from '@nestjs/common';
// import { format } from 'date-fns';
// import { getUsers } from 'database';
// import { User } from 'database';
// //https://stackoverflow.com/a/75356810

// @Injectable()
// export class AppService {
//   getHello = async (): Promise<string> => {
//     const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
//     const users = await getUsers();
//     const names = users.map((user: User) => user.name).join('<br>');

//     //return `Hello World!<br><br>${currentDate}${names && `<br><br>${names}`}`;
//     //<iframe src="https://www.crazygames.com/embed/super-bike-the-champion" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *;"></iframe>
//     //return the iframe
//     return `<iframe src="https://www.crazygames.com/embed/super-bike-the-champion" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *;"></iframe>`;
//   };
// }

import { Injectable } from '@nestjs/common';

export const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Oops! You Got Lost?</title>
  <style>
    body {
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background-color: #f0f0f0; 
      color: #333; 
    }
    h1 {
      font-size: 2em;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div>
    <h1>Oops! You Got Lost?</h1>
  </div>
</body>
</html>
    `;

@Injectable()
export class AppService {
  getHello = async (): Promise<string> => {
    return html;
  };
}
