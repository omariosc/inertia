import Cookies from "universal-cookie";
import host from "./host";
import {NotificationManager} from "react-notifications";

export class Account {
    constructor(name, role, id, accessToken) {
        this.name = name;
        this.role = role;
        this.id = id;
        this.accessToken = accessToken;
    }
}

export function signOut(setAccount, navigate) {
    const cookies = new Cookies();

    try {
        fetch(host + 'api/Users/authorize', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${cookies.get('accessToken')}`
            },
            body: JSON.stringify({
                'accessToken': cookies.get('accessToken')
            }),
            mode: "cors"
        }).then(r => {
            cookies.remove('accountRole');
            cookies.remove('accessToken');
            cookies.remove('accountID');
            cookies.remove('accountName');
            setAccount(null);
            navigate('/');
        });
    } catch (error) {
        console.error(error);
    }
}

export function signIn(setAccount, navigate, email, password) {
    const cookies = new Cookies();

    try {
        fetch(host + 'api/Users/authorize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'email': email,
                'password': password
            }),
            mode: "cors"
        }).then(r => {
            r.json().then(response => {
                console.log(response);
                if (response.accessToken) {
                    // Sets user cookies.
                    cookies.set("accountID", response.account.accountId, {path: '/'});
                    cookies.set("accountName", response.account.name, {path: '/'});
                    cookies.set("accountRole", response.account.role, {path: '/'});
                    cookies.set("accessToken", response.accessToken, {path: '/'});
                    setAccount(new Account(response.account.name, response.account.role, response.account.accountId, response.accessToken));
                    navigate('/');
                } else {
                    NotificationManager.error("Login credentials invalid.", "Error");
                }
            })
        })
    } catch (error) {
        console.log(error);
    }
}

export function accountFromCookies() {
    const cookies = new Cookies();

}