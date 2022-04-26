import host from './host';
import Cookies from "universal-cookie";
import {NotificationManager} from "react-notifications";

export default async function changePassword(oldPassword, password, confirmPassword) {
    const cookies = new Cookies();
    if (oldPassword.length < 1) {
        NotificationManager.error("Please enter your old password.", "Empty old password field");
        return;
    }
    if (!(password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))) {
        NotificationManager.error("Please enter a valid password. Passwords should contain minimum eight characters, " +
            "at least one uppercase letter, one lowercase letter, one number and one special character.", "Invalid password");
        return;
    }
    if (password !== confirmPassword) {
        NotificationManager.error("Passwords do not match", "Password mismatch");
        return;
    }
    if (oldPassword === password) {
        NotificationManager.error("Passwords must be different", "Same password");
        return;
    }
    try {
        let request = await fetch(host + `api/Users/${cookies.get('accountID')}/ChangePassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${cookies.get('accessToken')}`
            },
            body: JSON.stringify({
                'oldPassword': oldPassword,
                'newPassword': password
            }),
            mode: "cors"
        });
        let response = await request;
        if (response.status === 200) {
            NotificationManager.success("Password changed successfully", "Changed password");
        } else {
            NotificationManager.error("Old password entered was incorrect", "Incorrect password");
        }
    } catch (error) {
        console.error(error);
    }
};