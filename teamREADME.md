# COMP3900-M12A-AtlassianTwo

Hi guys, here is a readME for the team to go through.  Hopefully everything is there.

## Running the Project

Upon pulling the repo into your environment, you'll notice that running 'npm start' from within the frontend folder won't work.  We'll need to set up a few things first.

Setting up Frontend
Step 1: Setup Node Version Manager: nvm.
Step 2: Ensure Node JS is the required version.
Step 3: Ensure npm is installed. 
Step 4: Update All Packages.
Step 5: Run the Frontend.

Setting up Backend
Step 6: Install FastAPI.
Step 7: Run the Backend.

### Quick Setup Summary for CSE Machines

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
    nvm install 16.15.1
    nvm use 16.15.1
    cd myspaces-ui
    npm update
    npm start
    cd ../myspaces-server
    pip install "fastapi[all]"
    python3 -m uvicorn main:app --reload

### Quick Start

    cd myspaces-ui
    npm update
    npm start

     cd ../myspaces-server
     python3 -m uvicorn main:app --reload

### Step 1: Setup nvm

Run:
    
    nvm -v

If nvm is already installed, then let's install it:

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash

Then run:

    nvm -v

to double check :).

### Step 2: Install Node using nvm

Use nvm to install this.

    nvm install 16.15.1

Now set it to the current used version in your environment.

    nvm use 16.15.1

Finally, run:

    node -v

To ensure that we are using thhe correct version of node.

### Step 3: Node Package Manager: npm

Run:

    npm -v

npm should already be installed on cse systems and will also be carried around behind nvm.

### Step 4: Update All Packages

Navigate to the front end folder

    cd myspaces-ui

Run the following command.

    npm update

This command may take a minute or two.

This will update all the packages in the repo.  There is a .gitignore file in the repo that will allow us to skip uploading and downloading all the packages everytime we make updates.  Run npm update after every git pull.

### Step 5: Running the Frontend

Navigate to the frontend folder.

    cd myspaces-ui

From within the 'myspaces-ui' frontend folder, run the following.

    npm start

This will run the front end application.  If this fails, ensure that you are using the correct version of node.

    nvm use 16.15.1

This will pull up in the browser if it works with a loading screen.  This may take a while...we will work on cutting this down.

Once you run this command, Node JS allows us to make continuous updates to the source code in your editor and these updates will be applied directly to the browser.  So we can make UI changes while watching it change in the browser...neat :))

### Step 6: Installing FastAPI

In a fresh terminal, run the following.

    pip install "fastapi[all]"

This will install all requirements of fastAPI and uvicorn, which are two components we will need.

### Step 7: Running the Backend

Navigate to the backend folder.

    cd myspaces-server

Now run the python backend server with the following command.

    uvicorn main:app --reload

OR

    python3 -m uvicorn main:app --reload

Either one may or may not work, but hopefully one does.  We can now actively see response values update on the frontend delivered from the backend.  

## Cheatsheets

### Node Version Manager Cheatsheet

nvm is a clever software that allows fast installations of Node JS, which is what runs our javascript applications.  We can install multiple versions and switch between them quickly when needed.

Here are some quick commands to help you understand what versions of Node JS you have installed and which version you are using:

List: Lists all the versions of npm you have installed on the system
    
    nvm list

Install: Installing a particular version of Node JS.  If it is already installed, it will tell you and won't touch any sensitive files. 

    nvm install <version no.>

Use: Replacing version no. with the version that is listed with 'nvm list', we can switch the version of Node we are using.  If the version is not installed, it will prompt you to install it.

    nvm use <version no.>

Update: Allows us to recheck all the package versions in the application and update them if required. Use either or.

    npm update

Start: This is how we run the application.  From inside the frontend source code folder.  We can run the frontend server with the following.

    npm start

### Node JS Cheatsheet

You may need to run this multiple times whenever you log out and back in to your machine.  To set a version to the default opening version of Node, run the following.

    nvm alias default 16.15.1

Now whenever you run:

    nvm use default

It will set your node version to the set default version.  At the moment, theres no way to preserve the used version on CSE machines, but it will keep it installed.  (small pain, but we'll deal with it)

### Node Package Manager Cheatsheet

We use npm to manage our web browser application. There are numerous packages that are maintained within the application 'node_modules' folder which require a lot of maintenance and updates as we build the project and incorporate new libraries.

Update: Allows us to recheck all the package versions in the application and update them if required. Use either or.

    npm run update
    npm update

Rebuild: Does a quick compilation of our project for us and checks for inconsistencies. Use either or.

    npm run rebuild
    npm rebuild

Test: Won't be set up for a little while yet, but it will link to a specific filesystem chain of folders that we place our testing files inside of. We should aim to be writing tests for every feature we add to the project. This may include black box testing accompanied with TDD (Test Driven Development). Use either or.

    npm run test
    npm test

Start: Starting the application also won't be set up yet, but once there is an application is there to run, run the following to bring up the app in the web browser. Use either or.

    npm run start
    npm start

Install: Installing packages is something that the team will likely not require if you use run update whenever you want to get new changes to the application. Install is something I will use to incorporate new packages and libraries into the front end.

    npm install -g <node package>   