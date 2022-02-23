import unittest


class KwargsTestLoader(unittest.TestLoader):
    def loadTestsFromTestCase(self, test_case_class, **kwargs):
        test_case_names = self.getTestCaseNames(test_case_class)
        if not test_case_names and hasattr(test_case_class, 'runTest'):
            test_case_names = ['runTest']

        test_cases = []
        for test_case_name in test_case_names:
            test_cases.append(test_case_class(test_case_name, **kwargs))
        loaded_suite = self.suiteClass(test_cases)

        return loaded_suite
