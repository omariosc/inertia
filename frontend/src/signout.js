// Signs out from application. Deletes cookies and navigates to landing page.
import host from "./host";
import Cookies from "universal-cookie";

export default async function signOut() {
    const cookies = new Cookies();

    cookies.remove('accountRole');
    cookies.remove('accessToken');
    cookies.remove('accountID');
    cookies.remove('accountName');
    try {
        await fetch(host + 'api/Users/authorize', {
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
        });
    } catch (error) {
        console.error(error);
    }

    window.location.reload(true);
}
