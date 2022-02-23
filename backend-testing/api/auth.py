import requests
from dataclasses import dataclass


class AuthError(Exception):
    pass


@dataclass
class Account:
    account_id: str
    name: str
    email: str


@dataclass
class LoginResponse:
    access_token: str
    account: Account


def login(host: str, email: str, password: str):
    response = requests.post(
        host + '/users/authorize',
        verify=False,
        json={
            'email': email,
            'password': password
        }
    )

    if response.status_code != 200:
        raise AuthError('Login Failed')

    r = response.json()
    return LoginResponse(
        access_token=r['accessToken'],
        account=Account(
            account_id=r['account']['accountId'],
            name=r['account']['name'],
            email=r['account']['email']
        )
    )


def logout(host: str, access_token: str):
    response = requests.delete(
        host + f'/users/authorize',
        verify=False,
        headers={
            'Authorization': f'Bearer {access_token}'
        },
        json={
            'accessToken': access_token
        }
    )

    if response.status_code != 200:
        raise AuthError('Logout Failed')


def signup(host: str, email: str, name: str, password: str):
    response = requests.post(
        host + '/users/signup',
        verify=False,
        json={
            'name': name,
            'email': email,
            'password': password,
            'usertype': 0
        }
    )

    if response.status_code != 200:
        raise AuthError('Signup Failed')


def profile(host: str, account_id: str, access_token: str):
    response = requests.get(
        host + f'/users/{account_id}/profile',
        verify=False,
        headers={
            'Authorization': f'Bearer {access_token}'
        }
    )

    if response.status_code != 200:
        raise AuthError(f"Couldn't fetch profile, {response.status_code}: {response.content}")

    r = response.json()
    return Account(
            account_id=r['accountId'],
            name=r['name'],
            email=r['email']
    )


def debug_remove_account(host: str, email: str):
    response = requests.get(
        host + f'/debugging/remove/account/{email}',
        verify=False
    )

    if response.status_code != 200 and response.status_code != 422:
        raise AuthError(f'Failed executing remove command: {response.status_code}')
