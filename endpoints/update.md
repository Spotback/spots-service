# Update your spotback account

**PROD-URL** : `/TBD/updateAccount`

**DEV-URL** : `/TDB/updateAccount`

**Method** : `POST`

**JWT required** : YES

## Request

**Headers** :

* `Bearer: ${token}`
* `x-api-key: ${clientApiKey}`
* `spotback-correlation-id: ${uuid}`

**Body** :
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
  "stripeToken": "pm_1FZqMcFBWZTvTTeaR1Z6pPHY"
}
```

## Success Response

**Condition** : If everything is OK.

**Code** : `200 SUCCESS`

**Content example** :
New jwt in header and user with the updated fields in body

**Headers** :
* `Bearer: ${token}`


```json
{
  "balance": 0,
  "car": {
    "carType": "sedan",
    "color": "test",
    "make": "test",
    "model": "test",
    "year": "1234"
  },
  "created_time": 1572763052855,
  "email": "dylancorbus@outlook.com",
  "firstName": "Dylan",
  "freeSpots": 13,
  "lastName": "Corbus",
  "phone": "4087227387",
  "pushToken": "fJBKNfNJ5BI:APA91bGSxW6yFS9YEvTyYcQVkXThQ8fWp6SZvS5d9Z5aLW0-IiGnkXPPdBm7y_oToCoZ3c0m486d8HHDxztI5aAzHq0GCxe50F0gCs5YJLY8g7SnJ73jYUTEF_5QzgTvbZKVycCRdCxM",
  "referrals": [
    "spotbackteam@outlook.com"
  ],
  "stripeToken": "pm_1FZqMcFBWZTvTTeaR1Z6pPHY",
  "verified": false
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

# Verify your spotback account

**PROD-URL** : `/TBD/updateAccount`

**DEV-URL** : `/TBD/updateAccount`

**Method** : `GET`

**JWT required** : NO

## Request

**Headers** :

* `x-api-key: ${clientApiKey}`
* `spotback-correlation-id: ${uuid}`

## Success Response

**Condition** : If everything is OK.

**Code** : `200 SUCCESS`
User will be shown an html page saying their account was verified.

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
