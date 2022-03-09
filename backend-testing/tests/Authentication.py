import unittest

import api.client
from api.exceptions import ForbiddenException


class Authentication(unittest.TestCase):
    def __init__(self, test_name, host):
        super().__init__(test_name)
        self.client = api.client.Client(host)

    def test_authentication(self):
        self.client.debug_remove_account('invalid@example.com')
        self.client.signup('invalid@example.com', 'Test Account', 'thegate')
        self.client.login('invalid@example.com', 'thegate')
        self.client.logout()

    def test_profile(self):
        self.client.debug_remove_account('invalid@example.com')
        self.client.signup('invalid@example.com', 'Test Account', 'thegate')
        login_response = self.client.login('invalid@example.com', 'thegate')
        account = self.client.profile()
        self.assertEqual(account.name, 'Test Account', msg='profile endpoint returns bogous information')
        self.client.logout()

    def test_double_logout(self):
        self.client.debug_remove_account('invalid@example.com')
        self.client.signup('invalid@example.com', 'Test Account', 'thegate')
        self.client.login('invalid@example.com', 'thegate')
        self.client.logout()
        with self.assertRaises(ForbiddenException) as context:
            self.client.logout()
