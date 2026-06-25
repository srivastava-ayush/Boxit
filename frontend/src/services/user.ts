import api from "../api/api"; 


const fetchMe = async function() {
    const res = await api.get("/auth/me");
    return res.data;
}


  export { fetchMe };