import moment from "moment";
import { getUsers } from "database";

//--------------------------------------------

export default async function Home() {
  const users = await getUsers();

  const date = moment().format("YYYY-MM-DD HH:mm:ss");
  return (
    <div>
      TEST {date}
      {users?.map((user) => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
}
