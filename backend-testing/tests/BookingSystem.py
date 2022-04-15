import unittest
from datetime import datetime, timedelta

import api.client
from api.exceptions import ForbiddenException


class BookingSystem(unittest.TestCase):
    def __init__(self, test_name, host):
        super().__init__(test_name)
        self.host = host

    def test_order_creation(self):
        self.customer = api.client.Client(self.host)
        self.customer.login('inertiateam420+test@gmail.com', 'test_password')
        self.staff = api.client.Client(self.host)
        self.staff.login('inertiateam420+test2@gmail.com', 'test_password')

        t = datetime.now() + timedelta(days=1)

        hire_options = self.customer.hire_options()
        scooters = self.customer.get_available_scooters(
            startTime=str(t).replace(' ', 'T')
        )
        order_0 = self.customer.create_order(
            hire_option=hire_options[-1].hire_option_id,
            scooter=scooters[0].scooter_id,
            start_time=t)

        scooters = self.customer.get_available_scooters(
            startTime=str(t).replace(' ', 'T')
        )
        order_1 = self.customer.create_order(
            hire_option=hire_options[-1].hire_option_id,
            scooter=scooters[0].scooter_id,
            start_time=t)

        self.staff.admin_order_approve(order_0.order_id)
        self.staff.admin_order_deny(order_1.order_id)

        order_0 = self.customer.get_order(order_0.order_id)
        order_1 = self.customer.get_order(order_1.order_id)

        self.assertEqual(order_0.start_time, t)
        self.assertEqual(order_1.start_time, t)

        self.assertEqual(order_0.hire_option, hire_options[-1])
        self.assertEqual(order_1.hire_option, hire_options[-1])

        self.assertEqual(order_0.order_state, 2)
        self.assertEqual(order_1.order_state, 6)

        self.staff.debug_remove_order(order_0.order_id)
        self.staff.debug_remove_order(order_1.order_id)

    def test_scooter_availability_service(self):
        self.customer = api.client.Client(self.host)
        self.customer.login('inertiateam420+test@gmail.com', 'test_password')
        self.staff = api.client.Client(self.host)
        self.staff.login('inertiateam420+test2@gmail.com', 'test_password')

        t = datetime.now()

        depos = self.customer.list_depos()
        scooters = self.customer.get_available_scooters(
            startTime=str(t).replace(' ', 'T'),
            depoId=depos[0].depo_id
        )

        hire_option = self.customer.hire_options()[0]

        orders = [
            self.customer.create_order(
                hire_option=hire_option.hire_option_id,
                scooter=s.scooter_id,
                start_time=t
            )
            for s in scooters
        ]

        available = self.customer.count_available_scooters(
            startTime=str(t).replace(' ', 'T'),
            depoId=depos[0].depo_id
        )

        self.assertEqual(available.available, 0)

        for o in orders:
            self.staff.debug_remove_order(o.order_id)

    def test_staff_scooter_return(self):
        self.customer = api.client.Client(self.host)
        self.customer.login('inertiateam420+test@gmail.com', 'test_password')
        self.staff = api.client.Client(self.host)
        self.staff.login('inertiateam420+test2@gmail.com', 'test_password')

        t = datetime.now()

        depos = self.customer.list_depos()
        scooter = self.customer.get_available_scooters(
            startTime=str(t).replace(' ', 'T'),
            depoId=depos[0].depo_id
        )[0]
        hire_option = self.customer.hire_options()[0]

        before_available = self.customer.count_available_scooters(
            startTime=str(t).replace(' ', 'T'),
            depoId=depos[0].depo_id
        )

        order = self.customer.create_order(
            hire_option=hire_option.hire_option_id,
            scooter=scooter.scooter_id,
            start_time=t
        )

        self.staff.admin_order_approve(order.order_id)
        self.staff.admin_scooter_return(order.scooter_id)

        available = self.customer.count_available_scooters(
            startTime=str(t).replace(' ', 'T'),
            depoId=depos[0].depo_id
        )

        self.assertEqual(available.available, before_available.available)

        self.staff.debug_remove_order(order.order_id)

    def test_guest_order(self):
        self.staff = api.client.Client(self.host)
        self.staff.login('inertiateam420+test2@gmail.com', 'test_password')

        t = datetime.now()

        depos = self.staff.list_depos()
        scooter = self.staff.get_available_scooters(
            startTime=str(t).replace(' ', 'T'),
            depoId=depos[0].depo_id
        )[0]
        hire_option = self.staff.hire_options()[0]

        order = self.staff.admin_create_guest_order(
            email='emilianachubosky@gmail.com',
            name='Emiliana Chubosky',
            hire_option=hire_option.hire_option_id,
            scooter=scooter.scooter_id,
            start_time=t
        )

        order_renewed = self.staff.admin_get_order(order.order_id)

        self.assertEqual(order.order_id, order_renewed.order_id)

        self.staff.debug_remove_order(order.order_id)
        self.staff.debug_remove_account('emilianachubosky@gmail.com')
