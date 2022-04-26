from api import client
from datetime import datetime
import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

customer = client.Client('https://localhost:7220')
customer.login('inertiateam420+test@gmail.com', 'test_password')
print(customer.customer_orders())
print(customer.hire_options())


staff = client.Client('https://localhost:7220')
staff.login('inertiateam420+test2@gmail.com', 'test_password')

t = datetime.now()

depos = staff.list_depos()
scooter = staff.get_available_scooters(
    startTime=str(t).replace(' ', 'T'),
    depoId=depos[0].depo_id
)[0]
hire_option = staff.hire_options()[0]

order = staff.admin_create_guest_order(
    email='emilianachubosky@gmail.com',
    name='Emiliana Chubosky',
    hire_option=hire_option.hire_option_id,
    scooter=scooter.scooter_id,
    start_time=t
)

orders = staff.admin_order_list()

staff.debug_remove_order(order.order_id)
staff.debug_remove_account('emilianachubosky@gmail.com')