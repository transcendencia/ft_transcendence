import { updateUserStatus } from "./userManagement.js";
import { guestLoggedIn } from "./arenaPage.js";

export function disconnectLoggedGuest(userInfoCont, user, token) {
    lsCont.removeChild(userInfoCont);
    updateUserStatus('offline', token);
    // console.log("before logout:", guestLoggedIn);
    for (let i = 0; i < guestLoggedIn.length; i++) {
        if (guestLoggedIn[i][0].id === user.id) {
            guestLoggedIn.splice(i, 1);
        }
    }

    // console.log("after logout:", guestLoggedIn);
}
