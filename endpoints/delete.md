# Delete your spotback account

**PROD-URL** : `/TBD/deleteAccount`

**DEV-URL** : `/TBD/deleteAccount`

**Method** : `GET`

**JWT required** : YES

## Request

**Headers** :

* `x-api-key: ${clientApiKey}`
* `Bearer: ${token}`
* `spotback-correlation-id: ${uuid}`

## Success Response

**Condition** : If everything is OK.

**Code** : `200 SUCCESS`

**Content example** :

```json
{
    "code": "SUCCESS",
    "message": "Successfully Deleted account."
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
