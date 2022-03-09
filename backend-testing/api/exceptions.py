from api.data import ApplicationError


class UnauthorizedException(Exception):
    pass


class ForbiddenException(Exception):
    pass


class MethodNotAllowedException(Exception):
    pass


class ApplicationErrorException(Exception):
    def __init__(self, application_error: ApplicationError):
        self.application_error = application_error
        super().__init__(str(self.application_error))


class DebugException(Exception):
    pass
