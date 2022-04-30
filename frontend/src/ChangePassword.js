/*
	Purpose of file: Allow a user to change their password if they
	provide their correct current password.
*/

import {NotificationManager} from "react-notifications";
import { useAccount } from './authorize';
import host from './host';

// Changes user password.
export default async function changePassword(oldPassword, password, confirmPassword) {
    const [account] = useAccount();
    if (oldPassword.length < 1) {
        NotificationManager.error("Please enter your old password.", "Error");
        return false;
    }
    if (!(password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))) {
        NotificationManager.error("Please enter a valid password. Passwords should contain minimum eight characters, " +
            "at least one uppercase letter, one lowercase letter, one number and one special character.", "Error");
        return false;
    }
    if (password !== confirmPassword) {
        NotificationManager.error("Passwords do not match.", "Error");
        return false;
    }
    if (oldPassword === password) {
        NotificationManager.error("Passwords must be different.", "Error");
        return false;
    }
    try {
        let request = await fetch(host + `api/Users/${account.id}/ChangePassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${account.accessToken}`
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
            return true;
        } else {
            NotificationManager.error("Incorrect password.", "Error");
            return false;
        }
    } catch (error) {
        console.error(error);
        return false
    }
};