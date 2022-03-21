from datetime import datetime
from dateutil import parser as dateparser
from dataclasses import dataclass


@dataclass
class Account:
    account_id: str
    name: str
    email: str


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
    start_time: datetime
    end_time: datetime
    cost: float
    hire_option: HireOption
    order_state: int
    extensions: []


@dataclass
class Depo:
    depo_id: int
    name: str
    lat: float
    long: float


@dataclass
class Scooter:
    scooter_id: int
    depo_id: int
    depo: Depo
    status: int


@dataclass
class ApplicationError:
    code: int
    message: str
    detail: str


@dataclass
class LoginResponse:
    access_token: str
    account: Account


@dataclass
class CountResponse:
    available: int
    all: int


@dataclass
class Issue:
    id: int
    priority: int
    title: str
    content: str
    account_id: int
    date_opened: datetime
    resolution: str


def from_json_hire_option(o):
    if o is None:
        return None

    return HireOption(
        hire_option_id=o['hireOptionId'],
        name=o['name'],
        cost=o['cost'],
    )


def from_json_order(o):
    if o is None:
        return None

    return Order(
        order_id=o['orderId'],
        scooter_id=o['scooterId'],
        account_id=o['accountId'],
        start_time=dateparser.parse(o['startTime']),
        end_time=dateparser.parse(o['endTime']),
        cost=o['cost'],
        hire_option=from_json_hire_option(o['hireOption']),
        order_state=o['orderState'],
        extensions=[
            from_json_order(x)
            for x in o['extensions']] if o['extensions'] is not None else None
    )


def from_json_scooter(o):
    if o is None:
        return None

    return Scooter(
        scooter_id=o['scooterId'],
        depo_id=o['depoId'],
        depo=from_json_depo(o['depo']),
        status=o['scooterStatus'],
    )


def from_json_application_error(o):
    if o is None:
        return None

    return ApplicationError(
        code=o['errorCode'],
        message=o['message'],
        detail=o['detail']
    )


def from_json_account(o):
    if o is None:
        return None

    return Account(
        account_id=o['accountId'],
        name=o['name'],
        email=o['email']
    )


def from_json_login_response(o):
    if o is None:
        return None

    return LoginResponse(
        access_token=o['accessToken'],
        account=from_json_account(o['account'])
    )


def from_json_depo(o):
    if o is None:
        return None

    return Depo(
        depo_id=o['depoId'],
        name=o['name'],
        lat=o['latitude'],
        long=o['longitude'],
    )


def from_json_count_response(o):
    if o is None:
        return None

    return CountResponse(
        available=o['available'],
        all=o['all']
    )


def from_json_issue(o):
    if o is None:
        return None

    return Issue(
        id=o["issueId"],
        priority=o["priority"],
        title=o["title"],
        content=o["content"],
        account_id=o["accountId"],
        date_opened=dateparser.parse(o["dateOpened"]),
        resolution=o["resolution"]
    )
