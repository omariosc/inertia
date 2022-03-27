import host from './host';
import Cookies from "universal-cookie";

export default async function changePassword(oldPassword, password, confirmPassword) {
    const cookies = new Cookies();
    if (oldPassword.length < 1) {
        alert("Please enter your old password.");
        return;
    }
    if (!(password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))) {
        alert("Please enter a valid password. Passwords should contain minimum eight characters, " +
            "at least one uppercase letter, one lowercase letter, one number and one special character.");
        return;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
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
        let response = await request.json();
        alert(response.message)
    } catch (error) {
        console.error(error);
    }
}