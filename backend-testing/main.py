import argparse
import unittest
import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning

from util.testloader import KwargsTestLoader

from tests.ServerIsUp import ServerIsUp
from tests.Authentication import Authentication
from tests.BookingSystem import BookingSystem
from tests.IssueSystem import IssueSystem

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='inertia backend testing suite')
    parser.add_argument('host', type=str, help='the backend host url')
    args = parser.parse_args()

    requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

    test_cases = [
        ServerIsUp,
        Authentication,
        BookingSystem,
        IssueSystem
    ]

    loader = KwargsTestLoader()
    suites = [loader.loadTestsFromTestCase(test_case, host=args.host) for test_case in test_cases]
    combined_suite = unittest.TestSuite(suites)
    unittest.TextTestRunner(verbosity=3).run(combined_suite)
