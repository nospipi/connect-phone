import { Injectable } from '@nestjs/common';

//------------------------------------------------------

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
