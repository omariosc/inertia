import unittest

import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry


class ServerIsUp(unittest.TestCase):
    def __init__(self, test_name, host):
        super().__init__(test_name)
        retry_strategy = Retry(
            total=6,
            backoff_factor=2
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session = requests.Session()
        self.session.mount("https://", adapter)
        self.session.mount("http://", adapter)

        self.host = host

    def test_server_is_up(self):
        response = self.session.get(self.host, verify=False)
