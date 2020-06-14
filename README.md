# Commission calculator
Commission calculator calculates operation commissions for transactions saved in json file.

## Commission rules
Commission rules are fetched using apis, apis url can be modified in api/api.js. User and operation types can be modified in api/apiTypes.js file

## Input data
Input data should be given in JSON file with operations collected as an array of objects of this type:
```js
{
    "date": "2016-01-05", // operation date in format `Y-m-d`
    "user_id": 1, // user id, integer
    "user_type": "natural", // user type, one of “natural”(natural person) or “juridical”(legal person)
    "type": "cash_in", // operation type, one of “cash_in” or “cash_out”
    "operation": {
        "amount": 200, // operation amount(for example `2.12` or `3`)
        "currency": "EUR" // operation currency `EUR`
    }
}
```
All operations should be ordered by their date ascendingly.

## How to run and test application
Application test can be run with an npm script from a directory containing project package.json file or its child:
```
> npm test
```
Application can be called with an npm script with a path to data file (absolute or relative to package.json directory). For testing convinience there is a json file with sample data in the project directory:
```
> npm start sampleDataFile.json
```
Aternatively application can be called as a node application with paths to app.js and data file:
```
\tpt> node src\app.js sampleDataFile.json
```
or
```
\tpt\src> node app.js ..\sampleDataFile.json
```
