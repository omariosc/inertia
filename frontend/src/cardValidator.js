import {NotificationManager} from "react-notifications";

export default function validateCard(cardNo, expiry, cvv) {
    if (cardNo.length < 10 || cardNo.length > 19) {
        NotificationManager.error("Credit card number is invalid", "Incorrect card details");
        return 0;
    }
    if (!(expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/))) {
        NotificationManager.error("Expiry date is invalid. Must in the form \"MM/YY\"", "Incorrect card details");
        return 0;
    }
    if (!(cvv.match(/^[0-9]{3,4}$/))) {
        NotificationManager.error("CVV code is invalid", "Incorrect card details");
        return 0;
    }
    return 1;
}