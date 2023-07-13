# URL Shortener Microservice

This is the boilerplate code for the URL Shortener Microservice project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice.


## Current Implementation Issues

* We have not written any tests for our application. We could miss some cases and bugs.
* I think we could have several simultaneous requests to our application. This could lead to a race condition.

## Race Condition

Even when Node.js is single-threaded we could have race condition on our project. This is because we are using a database to store our data. The database is not single-threaded. So, we could have several simultaneous requests to our application. This could lead to a race condition.


## Solution 1 - Using Async/Await

First potential solution is forcing the 'second' process to wait until the 'first' process has finished. We can do this using `async/await`.

```javascript

const main = async () => {
    await firstProcess();
    await secondProcess();

    ...
}

```

## Solution 2 - Using Mutex

Another possible solution is using Mutex, which is a synchronization primitive that grants exclusive access to the shared resource to only one process at a time. This means that the second process will wait until the first process has finished.

```javascript
// https://www.nodejsdesignpatterns.com/blog/node-js-race-conditions/

import { Mutex } from 'async-mutex'

const mutex = new Mutex() 

async function doingSomethingCritical() {
  const release = await mutex.acquire() 
  try {
    // ... do something here
  } finally {
    release() 
  }
}

´´´

Resources: 
- [Nodejs Race Conditions by Luciano Mammino](https://www.nodejsdesignpatterns.com/blog/node-js-race-conditions/)
- [Nodejs Race Conditions by Riddhesh Ganatra](https://riddheshganatra.medium.com/node-js-race-conditions-69b21b54a1e1)