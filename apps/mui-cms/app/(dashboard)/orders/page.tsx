import * as React from "react";
import { getUsers } from "database";
import axios from "axios";
import { auth } from "@clerk/nextjs/server";
import { User } from "database";

//------------------------------------------------

const OrdersPage = async () => {
  //await new Promise((resolve) => setTimeout(resolve, 2000));
  //throw new Error("Test error");
  //const users = await getUsers();

  const { getToken } = await auth();
  const token = await getToken();

  const response = await axios.get("http://localhost:3001/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const users = response.data;

  return (
    <div>
      {users?.map((user: User) => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
};
export default OrdersPage;
