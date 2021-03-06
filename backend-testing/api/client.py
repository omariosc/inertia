from datetime import datetime
from time import sleep

import requests

from api.exceptions import *
from api.data import *


class Client:
    def __init__(self, host):
        self.host = host
        self.access_token = None
        self.account_id = None

    def login(self, email: str, password: str):
        r = self._request('post', '/users/authorize', json={
            'email': email,
            'password': password
        })

        l = from_json_login_response(r.json())
        self.access_token = l.access_token
        self.account_id = l.account.account_id

        return l

    def customer_orders(self):
        r = self._request('get', f'/users/{self.account_id}/orders')
        return [from_json_order(x) for x in r.json()]

    def hire_options(self):
        r = self._request('get', f'/hireoptions')
        return [from_json_hire_option(x) for x in r.json()]

    def create_order(self, hire_option: int, scooter: int, start_time: datetime):
        r = self._request('post', '/orders', json={
            'hireOptionId': hire_option,
            'scooterId': scooter,
            'startTime': str(start_time).replace(' ', 'T')
        })
        return from_json_order(r.json())

    def extend_order(self, order_id: str, hire_option: int):
        r = self._request('post', f'/orders/{order_id}/extend', json={
            'hireOptionId': hire_option,
        })
        return from_json_order(r.json())

    def cancel_order(self, order_id: str):
        r = self._request('post', f'/orders/{order_id}/cancel')
        return from_json_order(r.json())

    def list_depos(self):
        r = self._request('get', f'/depos')
        return [from_json_depo(x) for x in r.json()]

    def get_available_scooters(self, **params):
        r = self._request('get', f'/scooters/available', params=params)
        return [from_json_scooter(x) for x in r.json()]

    def count_available_scooters(self, **params):
        r = self._request('get', f'/scooters/count', params=params)
        return from_json_count_response(r.json())

    def get_scooter(self, scooter: int):
        r = self._request('get', f'/scooters/{scooter}/')
        return from_json_scooter(r.json())

    def get_order(self, order: str):
        r = self._request('get', f'/orders/{order}')
        return from_json_order(r.json())

    def user_get_issues(self):
        r = self._request('get', f'/users/{self.account_id}/issues')
        return [from_json_issue(x) for x in r.json()]

    def create_issue(self, title: str, content: str, priority: int = None):
        r = self._request('post', f'/users/{self.account_id}/issues', json={
            'priority': priority,
            'title': title,
            'content': content
        })
        return from_json_issue(r.json())

    def close_my_issue(self, issue_id: int):
        self._request('delete', f'/users/{self.account_id}/issues/{issue_id}')

    def get_issue(self, issue_id: int):
        r = self._request('get', f'/users/{self.account_id}/issues/{issue_id}')
        return from_json_issue(r.json())

    def admin_scooter_list(self):
        r = self._request('get', f'/admin/scooters')
        return [from_json_scooter(o) for o in r.json()]

    def admin_scooter_return(self, scooter: int):
        self._request('post', f'/admin/scooters/{scooter}/return')

    def admin_order_list(self):
        r = self._request('get', f'/admin/Orders')
        return [from_json_order(x) for x in r.json()]

    def admin_create_guest_order(self, email: str, name: str, hire_option: int, scooter: int, start_time: datetime):
        r = self._request('post', '/admin/Orders/CreateGuestOrder', json={
            'email': email,
            'name': name,
            'hireOptionId': hire_option,
            'scooterId': scooter,
            'startTime': str(start_time).replace(' ', 'T')
        })
        return from_json_order(r.json())

    def admin_get_order(self, order):
        r = self._request('get', f'/admin/orders/{order}')
        return from_json_order(r.json())

    def admin_order_approve(self, order: str):
        self._request('post', f'/admin/orders/{order}/approve')

    def admin_order_deny(self, order: str):
        self._request('post', f'/admin/orders/{order}/deny')

    def admin_list_issues(self, **params):
        r = self._request('get', f'/admin/issues', params=params)
        return [from_json_issue(x) for x in r.json()]

    def admin_set_issue_priority(self, issue_id: int, priority: int):
        self._request('patch', f'/admin/issues/{issue_id}', json={
            'priority': priority
        })

    def admin_close_issue(self, issue_id: int, resolution: str):
        self._request('patch', f'/admin/issues/{issue_id}', json={
            'resolution': resolution
        })

    def admin_get_issue(self, issue_id):
        r = self._request('get', f'/admin/issues/{issue_id}')
        return from_json_issue(r.json())

    def logout(self):
        r = self._request('delete', '/users/authorize', json={
            'accessToken': self.access_token
        })

    def signup(self, email, name, password):
        r = self._request('post', '/users/signup', json={
            'name': name,
            'email': email,
            'password': password,
            'userType': 0
        })

    def profile(self):
        r = self._request('get', f'/users/{self.account_id}/profile')
        return from_json_account(r.json())

    def debug_remove_account(self, email):
        self._debug_request('get', f'/debugging/remove/account/{email}')

    def debug_remove_order(self, order):
        self._debug_request('get', f'/debugging/remove/order/{order}')

    def _request(self, request_type, endpoint, **kwargs):
        requests_types = {
            'delete': requests.delete,
            'post': requests.post,
            'get': requests.get,
            'patch': requests.patch
        }

        if self.access_token is not None:
            kwargs['headers'] = {
                'Authorization': f'Bearer {self.access_token}'
            }

        response = requests_types[request_type](
            self.host + '/api' + endpoint,
            verify=False,
            **kwargs
        )

        try:
            if response.status_code == 401:
                raise UnauthorizedException()

            if response.status_code == 403:
                raise ForbiddenException()

            if response.status_code == 422:
                raise ApplicationErrorException(from_json_application_error(response.json()))

            if response.status_code == 405:
                raise MethodNotAllowedException()

        except ApplicationErrorException as e:
            if e.application_error.message == 'too many login requests':
                sleep(0.2)
                return self._request(request_type, endpoint, **kwargs)
            else:
                raise e

        return response

    def _debug_request(self, request_type, endpoint, **kwargs):
        requests_types = {
            'delete': requests.delete,
            'post': requests.post,
            'get': requests.get,
            'patch': requests.patch
        }

        response = requests_types[request_type](
            self.host + '/api' + endpoint,
            verify=False,
            **kwargs
        )

        if response.status_code != 200 and response.status_code != 422:
            raise DebugException()

        return response
