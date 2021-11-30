***************************
Appointment System Demo
**************************

URL
1) API Documentation: https://documenter.getpostman.com/view/5898250/UVJeEbNq
2) Git link: 

How to install Node JS
=====================
1) Linux system
-----------------
a) Check nodejs is already installed in OS by typing
node -v
If there is a node version number printed, it means nodejs is already installed.

b) If nodejs is not installed yet, download it by typing
wget https://nodejs.org/dist/v12.3.0/node-v12.3.0-linux-x64.tar.gz

Install by typing (the directory will be the downloaded file directory)
tar --strip-components 1 -xzf /usr/save/node-v12.3.0-linux-x64.tar.gz


2) Windows OS
---------------
a) Check nodejs is already installed in OS by typing in cmd
node -v

b) If nodejs is not installed yet, go to
https://nodejs.org/en/download/ for downloading the installer


To execute program
===================
1. Open command window (cmd) and change directory to project directory.

2. Install required library (first time) by typing
npm install

3. Create a database called "demo" in your mysql database

4. Perform DB migration by typing
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

5. To start the program, type
node app.js

6. To view the interface, open a browser and type
http://localhost:8888

