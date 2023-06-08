# AMRIT - Admin 
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)  ![branch parameter](https://github.com/PSMRI/Admin-UI/actions/workflows/sast-and-package.yml/badge.svg)


The Admin Module is a collection of tools and scripts that allow users to manage the project. It includes tools for managing users, permissions, and settings.It is the master of all branches.
Admin module provides a user-friendly interface for managing your application. It includes features such as:

User management
Role management
Permission management


## Building From Source
This microservice is built on Java, Spring boot framework and MySQL DB.

Prerequisites 
* Admin-API module should be running
* JDK 1.8
* Maven 
* Nodejs
* Springboot V2
* MySQL


## Installation
This service has been tested on Wildfly as the application server.

To install the admin module, follow these steps:

Clone the repository to your local machine.
Install the dependencies.

* npm install
* npm run build
* mvn clean install

Run the development server.
* npm start

## Configuration
The admin module can be configured by editing the config.js file. This file contains all of the settings for the module, such as the database connection string, the user authentication mechanism, and the role hierarchy.


## Usage
All the features have been exposed as REST endpoints.
Refer to the SWAGGER API specification for details.

The admin module can be used to manage all aspects of your application.
To access the admin module, navigate to http://localhost:3000/admin in your browser.
You will be prompted to login with a valid user account. Once you have logged in, you will be able to view and manage all of the resources in your application.


<!-- # Iemrdash

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
-->
