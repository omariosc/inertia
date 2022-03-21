import unittest
from datetime import datetime, timedelta

import api.client
from api.exceptions import ForbiddenException


class IssueSystem(unittest.TestCase):
    def __init__(self, test_name, host):
        super().__init__(test_name)
        self.host = host

    def test_issue_system(self):
        self.customer = api.client.Client(self.host)
        self.customer.login('test@test.com', 'test_password')
        self.staff = api.client.Client(self.host)
        self.staff.login('test2@test.com', 'test_password')

        issue = self.customer.create_issue("i am sad :(", "hey human how r u")
        self.staff.admin_close_issue(issue.id, "heya :)")
        issue = self.customer.get_issue(issue.id)

        all_closed_issues = self.staff.admin_list_issues(closed=True)
        self.assertIn(issue, all_closed_issues)
