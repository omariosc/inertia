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

order = customer.create_order(1, 103, datetime.now())
print(order)

staff.admin_order_approve(order.order_id)
for s in staff.admin_scooter_list():
    print(s)
