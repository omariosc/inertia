import Cookies from "universal-cookie";
import host from "./host";
import {NotificationManager} from "react-notifications";
import {createContext, useContext, useMemo, useState} from "react";

export class Account {
    constructor(name, role, id, accessToken) {
        this.name = name;
        this.role = role;
        this.id = id;
        this.accessToken = accessToken;
    }
}

export function signOut(setAccount) {
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
        });
    } catch (error) {
        console.error(error);
    }
}

export function signIn(setAccount, email, password, callback) {
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
                    setAccount(new Account(
                        response.account.name,
                        String(response.account.role),
                        response.account.accountId,
                        response.accessToken)
                    );

                    callback('login success');
                } else {
                    callback('login error');
                }
            })
        })
    } catch (error) {
        console.log(error);
    }
}

export function accountFromCookies() {
    const cookies = new Cookies();

    let accountRole = cookies.get('accountRole');
    let accountName = cookies.get('accountName');
    let accountToken = cookies.get('accessToken');
    let accountID = cookies.get('accountID');

    if (
        accountRole == null ||
        accountName == null ||
        accountToken == null ||
        accountID == null
    ) {
        return null;
    }

    return new Account(
        accountName,
        accountRole,
        accountID,
        accountToken
        );
}

const AccountContext = createContext(null);

export function useAccount() {
    const context = useContext(AccountContext);

    if (!context) {
        throw new Error(`useAccount must be used within an AccountProvider`);
    }

    return context;
}

export function AccountProvider(props) {
    const [account, setAccount] = useState(accountFromCookies());
    const value = useMemo(() => [
        account,
        () => signOut(setAccount),
        (email, password) => signIn(setAccount, email, password)
    ], [account]);
    return <AccountContext.Provider value={value} {...props} />;
}
