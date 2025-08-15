// AuthCallback.js (React)
import { useEffect } from "react";
import axios from "axios";
import Loader from "./loader"; // Assuming you have a loader component

export default function AuthCallback() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      axios
        .get(`http://localhost:5000/api/auth/github/callback?code=${code}`)
        .then((res) => {
            
            if(res.status===200)
            {
                
        window.location.href = `http://localhost:3000/dashboard?token=${res.data.access_token}`;
            }
          // Redirect to dashboard with token
         
        })
        .catch((err) => console.error(err));
    }
  }, []);

 return <Loader size={50} color="#24292f" borderWidth={4} />;;
}
