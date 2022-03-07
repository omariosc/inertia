import requests
from dataclasses import dataclass
from datetime import datetime


class CustomerError(Exception):
    pass


@dataclass
class HireOption:
    hire_option_id: int
    name: str
    cost: float


@dataclass
class Order:
    order_id: str
    scooter_id: int
    account_id: str
    start_time: str
    end_time: str
    cost: float
    hire_option: HireOption
    extensions: []


def from_json_hire_option(o):
    return HireOption(
        hire_option_id=o['hireOptionId'],
        name=o['name'],
        cost=o['cost'],
    )


def from_json_order(o):
    return Order(
        order_id=o['orderId'],
        scooter_id=o['scooterId'],
        account_id=o['accountId'],
        start_time=o['startTime'],
        end_time=o['endTime'],
        cost=o['cost'],
        hire_option=from_json_hire_option(o['hireOption']),
        extensions=[
            from_json_order(x)
            for x in o['extensions']] if o['extensions'] is not None else None
    )


class Customer:
    def __init__(self, host: str, account_id: str, access_token: str):
        self.host = host
        self.account_id = account_id
        self.access_token = access_token

    def customer_orders(self):
        response = requests.get(
            self.host + f'/users/{self.account_id}/orders',
            verify=False,
            headers={
                'Authorization': f'Bearer {self.access_token}'
            },
        )

        if response.status_code != 200:
            raise CustomerError(f'Could not fetch Orders List, {response.status_code}')

        r = response.json()

        return [from_json_order(x) for x in r]

    def hire_options(self):
        response = requests.get(
            self.host + '/hireoptions',
            verify=False,
        )

        if response.status_code != 200:
            raise CustomerError(f'Could not fetch Hire Options List, {response.status_code}')

        r = response.json()
        return [from_json_hire_option(x) for x in r]

    def create_order(self, hire_option: int, scooter: int, start_time: datetime):
        response = requests.post(
            self.host + '/Orders',
            verify=False,
            headers={
                'Authorization': f'Bearer {self.access_token}'
            },
            json={
                'hireOptionId': hire_option,
                'scooterId': scooter,
                'startTime': str(start_time).replace(' ', 'T')
            }
        )

        if response.status_code != 200:
            raise CustomerError(f'Could not fetch Create Order, {response.status_code}, {response.content}')

        r = response.json()
        return from_json_order(r)

    def cancel_order(self, order_id: str):
        response = requests.post(
            self.host + f'/Orders/{order_id}/cancel',
            verify=False,
            headers={
                'Authorization': f'Bearer {self.access_token}'
            }
        )

        if response.status_code != 200:
            raise CustomerError(f'Could not Cancel Order, {response.status_code}, {response.content}')

    def extend_order(self, order_id: str, hire_option: int):
        response = requests.post(
            self.host + f'/Orders/{order_id}/extend',
            verify=False,
            headers={
                'Authorization': f'Bearer {self.access_token}'
            },
            json={
                'hireOptionId': hire_option,
            }
        )

        if response.status_code != 200:
            raise CustomerError(f'Could not Extend Order, {response.status_code}, {response.content}')

        r = response.json()
        return from_json_order(r)
