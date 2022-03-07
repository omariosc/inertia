from api.auth import *
from api.customer import *
from datetime import datetime
from requests.packages.urllib3.exceptions import InsecureRequestWarning

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

login_data = login('https://localhost:7220', 'test@test.com', 'test_password')
customer = Customer('https://localhost:7220', login_data.account.account_id, login_data.access_token)
print(customer.customer_orders())
print(customer.hire_options())
order = customer.create_order(1, 103, datetime.now())
print(order)
customer.extend_order(order.order_id, 1)
print(order)
customer.cancel_order(order.order_id)
