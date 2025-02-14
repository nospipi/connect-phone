import { format } from "date-fns";
import { getUsers } from "database";

//--------------------------------------------

export default async function Home() {
  const users = await getUsers();

  const currentDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  return (
    <div>
      TEST {currentDate}
      {users?.map((user) => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
}
