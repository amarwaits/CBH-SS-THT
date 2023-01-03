# CBH-SS-THT

#### Objective
In this problem we’ll create a micro-service to address some functionality which is useful to derive simplified summary statistics (mean, min, max) on a dataset. The dataset that you’ll be working with can be found later in the document and yes, it’s been kept very simple by design.

NOTE: Whenever we mention <SS> we mean summary statistics which essentially means 3 values (mean, min, max)

#### Requirements
For this assignment, we are looking for following functionality to be implemented:
1. An API to add a new record to the dataset.
2. An API to delete a record to the dataset.
3. An API to fetch SS for salary over the entire dataset. You can ignore the currency (if not mentioned otherwise) of the salary and simply treat salary as a number.
4. An API to fetch SS for salary for records which satisfy "on_contract": "true".
5. An API to fetch SS for salary for each department. This means that whatever you’ll do in Step 3, should be done for each department. The return of this API should have 1 SS available for each unique department.
6. An API to fetch SS for salary for each department and sub-department combination. This is similar to Case 5 but 1 level of nested aggregation.

A few notes on implementation:
- Please have a `readme.md` at the root of your project, which should contain all the necessary steps for us to run your service. In addition your `readme.md` should have examples on running all the API end-points that you’ll implement.
- Please use docker to bootstrap all infrastructure for this project. This means a `docker-compose.yaml` should be there at the root of your project and that a simple docker-compose up at the root of the project should be sufficient to run your service.
- One test case for every API that you will implement. The instructions to run the test should be part of your `readme.md`.
- For this exercise you can use an in-memory data structure to keep the entire data in-memory. This will help you avoid any DB setup. If you feel like it, you can use an in-memory DB implementation like H2 or a standalone binary implementation like SQLLite. Feel free to make a choice here.
- Implement basic authentication and authorisation. For this part, you can create a dummy user (with any username and password) and then use those credentials to authenticate. As for authorisation, you can use any token based mechanism available in your choice of stack. We’ll test this functionality by first checking for a happy / failed case for authentication and then doing the same for authorisation by trying to alter the authorisation token and see if we are able to interact with the
APIs.
- Error handling. For this part we expect at least following things:
	- The input payloads should be validated for their schema.
	- The use of proper error codes when authentication and authorisation fails or when there’s a logic error in your code.

#### Tech Design
We have used in-memory data structures to implement this assignment. APIs to get stats use cache for fast response. Cache is cleared when a new salary record or an existing record is deleted.
* `src/services/salary-stats.service.ts` defines the business logic to manage & serve the data.
* `src/controllers/salary.controller.ts` implements the handlers for API end-points.
* `src/models/salary-stat.request.model.ts` contains the schema objects for add/delete salary record.
* `src/app.ts` contains the logic to start the web server.
* `Dockerfile` contains the docker build (& run) steps.
* `docker-compose.yaml` is the `docker-compose` file configuration file.

##### Dependencies:
1. Node v17.x or above (Installation guide: https://www.pluralsight.com/guides/getting-started-with-nodejs)
2. Latest Docker (Installation guide: https://docs.docker.com/desktop/install/mac-install/)

##### Running the code
- Run server after moving the root directory of repository
	>`docker-compose up`

##### Test cases
- Run unit tests after moving the root directory of repository
	>`npm install`
	>`npm run test`

##### API Endpoints
1. Login (& get token)
```php
Request:
curl --location --request POST 'http://localhost:8080/api/user/login' \
--header 'Content-Type: application/json' \
--data-raw '{
	"username": "test",
	"password": "test232@32"
}'

Response:
{
	"status": true,
	"message": "64ee0521-9eac-4004-99db-9f202f1e3a79"
}
```
2. Add salary record
```php
Request:
curl --location --request PUT 'http://localhost:8080/api/salary-stat/record' \
--header 'token: 07800e75-9461-4e7e-8731-3e12c7256d36' \
--header 'Content-Type: application/json' \
--data-raw '{
	"name": "Amar",
	"salary": "15000",
	"currency": "USD",
	"department": "Engineering",
	"sub_department": "Platform",
	"on_contract": "true"
}'

Response:
{
	"status": true
}
```
3. Delete salary record
```php
Request:
curl --location --request DELETE 'http://localhost:8080/api/salary-stat/record' \
--header 'token: 07800e75-9461-4e7e-8731-3e12c7256d36' \
--header 'Content-Type: application/json' \
--data-raw '{
	"name": "Rahul",
	"department": "Engineering",
	"sub_department": "Platform"
}'

Response:
{
	"status": true
}
```
4. Get overall salary stats for all employees
```php
Request:
curl --location --request GET 'http://localhost:8080/api/salary-stat' \
--header 'token: 3e75bcd0-8234-408e-8ccd-8d818a6b12c0'

Response:
{
	"status": true,
	"data": {
		"min": 0,
		"max": 0,
		"mean": 0
	}
}
```
5. Get overall salary stats for contract employees
```php
Request:
curl --location --request GET 'http://localhost:8080/api/salary-stat?contractOnly=true' \
--header 'token: 3e75bcd0-8234-408e-8ccd-8d818a6b12c0'

Response:
{
	"status": true,
	"data": {
		"min": 0,
		"max": 0,
		"mean": 0
	}
}
```
6. Get department wise salary stats for all employees
```php
Request:
curl --location --request GET 'http://localhost:8080/api/salary-stat/department' \
--header 'token: 3e75bcd0-8234-408e-8ccd-8d818a6b12c0'

Response:
{
	"status": true,
	"data": {
		"engineering" : {
			"min": 0,
			"max": 0,
			"mean": 0
		}
	}
}
```
7. Get sub-department wise salary stats for all employees
```php
Request:
curl --location --request GET 'http://localhost:8080/api/salary-stat/sub-department' \
--header 'token: 3e75bcd0-8234-408e-8ccd-8d818a6b12c0'

Response:
{
	"status": true,
	"data": {
		"engineering" : {
			"platform" : {
				"min": 0,
				"max": 0,
				"mean": 0
			}
		},
		"operations" : {
			"customeronboarding" : {
				"min": 0,
				"max": 0,
				"mean": 0
			}
		},
	}
}
```
