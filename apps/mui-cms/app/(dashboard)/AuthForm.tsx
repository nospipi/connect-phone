// // components/AuthForm.tsx
// "use client";

// import { useState } from "react";
// import { useAuth } from "@clerk/nextjs";

// export default function AuthForm() {
//   const [result, setResult] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   async function fetchUserProfile() {
//     const { getToken } = useAuth();
//     const token = await getToken();

//     try {
//       const response = await fetch("http://localhost:3001/auth/me", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         // This is important for server actions
//         cache: "no-store",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch user profile");
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//       return { error: "Failed to fetch profile data" };
//     }
//   }

//   async function handleAction() {
//     setLoading(true);
//     const data = await fetchUserProfile();
//     setResult(data);
//     setLoading(false);
//   }

//   return (
//     <div>
//       <button onClick={handleAction} disabled={loading}>
//         {loading ? "Loading..." : "Call Auth Endpoint"}
//       </button>

//       {result && (
//         <div>
//           <h3>Response:</h3>
//           <pre>{JSON.stringify(result, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ClientSideAuth() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  console.log("isSignedIn", isSignedIn);
  const [token, setToken] = useState(null);
  console.log("TOKENNN", token);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  // Get the token when the component mounts
  useEffect(() => {
    async function fetchToken() {
      if (isLoaded && isSignedIn) {
        const sessionToken = (await getToken()) as any;
        setToken(sessionToken);
      }
      setLoading(false);
    }

    fetchToken();
  }, [isLoaded, isSignedIn, getToken]);

  async function handleFetchProfile() {
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:3001/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.data;
      setResult(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  if (loading) {
    return <div>Loading auth state...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to access this feature</div>;
  }

  return (
    <div>
      <button onClick={handleFetchProfile}>Fetch User Profile</button>

      {result && (
        <div>
          <h3>Response:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
          <span>{token}</span>
        </div>
      )}
    </div>
  );
}
