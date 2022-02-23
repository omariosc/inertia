import unittest
import requests

import api.auth


class Authentication(unittest.TestCase):
    def __init__(self, test_name, host):
        super().__init__(test_name)
        self.host = host

    def test_authentication(self):
        api.auth.debug_remove_account(self.host, 'invalid@example.com')
        api.auth.signup(self.host, 'invalid@example.com', 'Test Account', 'thegate')
        login_response = api.auth.login(self.host, 'invalid@example.com', 'thegate')
        api.auth.logout(self.host, login_response.access_token)

    def test_profile(self):
        api.auth.debug_remove_account(self.host, 'invalid@example.com')
        api.auth.signup(self.host, 'invalid@example.com', 'Test Account', 'thegate')
        login_response = api.auth.login(self.host, 'invalid@example.com', 'thegate')
        account = api.auth.profile(self.host, login_response.account.account_id, login_response.access_token)
        self.assertEqual(account.name, 'Test Account', msg='profile endpoint returns bogous information')
        api.auth.logout(self.host, login_response.access_token)

    def test_double_logout(self):
        api.auth.debug_remove_account(self.host, 'invalid@example.com')
        api.auth.signup(self.host, 'invalid@example.com', 'Test Account', 'thegate')
        login_response = api.auth.login(self.host, 'invalid@example.com', 'thegate')
        api.auth.logout(self.host, login_response.access_token)
        with self.assertRaises(api.auth.AuthError) as context:
            api.auth.logout(self.host, login_response.access_token)
