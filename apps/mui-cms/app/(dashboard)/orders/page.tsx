import * as React from "react";
import { getUsers } from "database";

//------------------------------------------------

export default async function OrdersPage() {
  //await new Promise((resolve) => setTimeout(resolve, 1000));
  const users = await getUsers();
  return (
    <div>
      {users?.map((user) => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
}
