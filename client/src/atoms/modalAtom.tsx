import { atom } from "recoil";

// Define a function to retrieve the user info from localStorage
const getUserFromLocalStorage = () => {
    if (typeof window !== "undefined") {
        const userInfo = localStorage.getItem("userInfo");
        return userInfo ? JSON.parse(userInfo) : null;
    }
    return null;
};

export const signupModalState = atom({
    key: "signupModalState", // unique ID (with respect to other atoms/selectors)
    default: false, // default value (aka initial value)
});

export const userState = atom({
    key: "userState",
    default: getUserFromLocalStorage(), // Check localStorage for user info
});
  