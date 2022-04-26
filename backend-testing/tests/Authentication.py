import unittest

import api.client
from api.exceptions import ForbiddenException


class Authentication(unittest.TestCase):
    def __init__(self, test_name, host):
        super().__init__(test_name)
        self.client = api.client.Client(host)

    def test_authentication(self):
        self.client.debug_remove_account('inertiateam420+invalid@gmail.com')
        self.client.signup('inertiateam420+invalid@gmail.com', 'Test Account', 'thegate')
        self.client.login('invalid@inertia', 'thegate')
        self.client.logout()

    def test_profile(self):
        self.client.debug_remove_account('inertiateam420+invalid@gmail.com')
        self.client.signup('inertiateam420+invalid@gmail.com', 'Test Account', 'thegate')
        login_response = self.client.login('inertiateam420+invalid@gmail.com', 'thegate')
        account = self.client.profile()
        self.assertEqual(account.name, 'Test Account', msg='profile endpoint returns bogous information')
        self.client.logout()

    def test_double_logout(self):
        self.client.debug_remove_account('inertiateam420+invalid@gmail.com')
        self.client.signup('inertiateam420+invalid@gmail.com', 'Test Account', 'thegate')
        self.client.login('inertiateam420+invalid@gmail.com', 'thegate')
        self.client.logout()
        with self.assertRaises(ForbiddenException) as context:
            self.client.logout()
