import api from "../api/api"; //  axios wrapper


const fetchMe = async function() {
    const res = await api.get("/auth/me");
    return res.data;
}
const addXp = async function(amount: number) {
    const res = await api.patch("/auth/me", { action: "addXp", amount });
    return res.data.user;
  }

  const incrementStreak = async function () {
    const res = await api.patch("/auth/me", { action: "incrementStreak" });
    return res.data.user;
  }

const resetStreak = async function () {
    const res = await api.patch("/auth/me", { action: "resetStreak" });
    return res.data.user;
  }

  export { fetchMe, addXp, incrementStreak, resetStreak };