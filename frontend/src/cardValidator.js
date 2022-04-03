export default function validateCard(cardNo, expiry, cvv) {
    if (cardNo.length < 10 || cardNo.length > 19) {
        alert("Credit card number is invalid.");
        return 0;
    }
    if (!(expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/))) {
        alert("Expiry date is invalid. Must in the form \"MM/YY\"");
        return 0;
    }
    if (!(cvv.match(/^[0-9]{3,4}$/))) {
        alert("CVV code is invalid.");
        return 0;
    }
    return 1;
}