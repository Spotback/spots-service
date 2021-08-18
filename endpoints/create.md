# Create your spotback account

**PROD-URL** : `/TBD/createAccount`

**DEV-URL** : `/TBD/createAccount`

**Method** : `POST`

**JWT required** : NO

## Request

**Headers** :

* `x-api-key: ${clientApiKey}`
* `spotback-correlation-id: ${uuid}`

**Body** :
Required fields:

* email
* password
* firstName
* lastName
* phone

May contain the following fields
```json
{
  "car": {
    "carType": "coupe",
    "color": "red",
    "make": "honda",
    "model": "civic",
    "year": "1995"
  },
  "email": "spotbackteam@outlook.com",
  "firstName": "Test",
  "lastName": "User",
  "password": "Test",
  "phone": "14087227387",
  "pushToken": "fJBKNfNJ5BI:APA91bGSxW6yFS9YEvTyYcQVkXThQ8fWp6SZvS5d9Z5aLW0-IiGnkXPPdBm7y_oToCoZ3c0m486d8HHDxztI5aAzHq0GCxe50F0gCs5YJLY8g7SnJ73jYUTEF_5QzgTvbZKVycCRdCxM",
  "stripeToken": "pm_1FZqMcFBWZTvTTeaR1Z6pPHY",
  "referralCode": "123456"
}
```

## Success Response

**Condition** : If everything is OK.

**Code** : `200 SUCCESS`

**Content example** :
New jwt in header and freeSpot info

**Headers** :
* `Bearer: ${token}`


```json
{
  "message": "Account created successfully!",
  "freeSpots": 0
}
```

## Error Responses

**Condition** : Request is either invalid or missing information.

**Code** : `400 INVALID REQUEST`

**Content example** :

```json
{
    "code":"INVALID REQUEST.",
    "message":"Description about the error"
}
```

**Condition** : Jwt token in the header is missing or invalid.

**Code** : `401 UNAUTHORIZED`

**Content example** :

```json
{
    "code":"UNAUTHORIZED.",
    "message":"Description about the error"
}
```

**Condition** : Encountered an error on in a backend system.

**Code** : `500 INTERNAL SERVER ERROR`

**Content example** :

```json
{
    "code":"INTERNAL SERVER ERROR.",
    "message":"Description about the error"
}
```

**Condition** : Encountered an error on in a backend system.

**Code** : `502 SERVICE TIMEOUT`

**Content example** :

```SERVICE TIMEOUT.```
