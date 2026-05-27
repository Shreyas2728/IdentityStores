import { addressValidate } from '../SchemaValidation/addressvalidation.js';

const payloadWithCapitalS = {
    "user_id":"faf9472d-dd94-4498-9c4d-75ac77daff00",
    "recipient_name":"Niranjan",
    "recipient_phone":"9972453128",
    "address_line1":"kgnogogo",
    "address_line2":"kjgkejoeg",
    "city":"bengaluru",
    "State":"Karanataka",
    "postal_code":"566428",
    "country":"India",
    "address_type":"Home"
};

const payloadWithLowercaseS = {
    "user_id":"faf9472d-dd94-4498-9c4d-75ac77daff00",
    "recipient_name":"Niranjan",
    "recipient_phone":"9972453128",
    "address_line1":"kgnogogo",
    "address_line2":"kjgkejoeg",
    "city":"bengaluru",
    "state":"Karanataka",
    "postal_code":"566428",
    "country":"India",
    "address_type":"Home"
};

console.log("TEST WITH CAPITAL 'State':");
const r1 = addressValidate.safeParse(payloadWithCapitalS);
if (!r1.success) {
    console.log(r1.error.flatten().fieldErrors);
} else {
    console.log("Success!");
}

console.log("\nTEST WITH LOWERCASE 'state':");
const r2 = addressValidate.safeParse(payloadWithLowercaseS);
if (!r2.success) {
    console.log(r2.error.flatten().fieldErrors);
} else {
    console.log("Success!");
}
