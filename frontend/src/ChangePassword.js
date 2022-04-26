import host from './host';
import Cookies from "universal-cookie";
import {NotificationManager} from "react-notifications";

// Changes user password.
export default async function changePassword(oldPassword, password, confirmPassword) {
    const cookies = new Cookies();
    if (oldPassword.length < 1) {
        NotificationManager.error("Please enter your old password.", "Error");
        return;
    }
    if (!(password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))) {
        NotificationManager.error("Please enter a valid password. Passwords should contain minimum eight characters, " +
            "at least one uppercase letter, one lowercase letter, one number and one special character.", "Error");
        return;
    }
    if (password !== confirmPassword) {
        NotificationManager.error("Passwords do not match.", "Error");
        return;
    }
    if (oldPassword === password) {
        NotificationManager.error("Passwords must be different.", "Error");
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
            NotificationManager.success("Changed password.", "Success");
        } else {
            NotificationManager.error("Incorrect password.", "Error");
        }
    } catch (error) {
        console.error(error);
    }
};