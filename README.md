# List-less: A MEAN Todo List

The is a fairly quick and easy example of employing Node, MongoDB & AngularJS to create a web application having both session and REST/key based authentication.

Here's how to get started:

* To run the app, you'll need to fire up an instance of MongoDB (http://docs.mongodb.org/manual/installation/).
* Wire MongoDB up to the node server by setting `mongodb -> uri` in config/default.json (http://docs.mongodb.org/manual/reference/connection-string/).
* Go to the project root in a console window and load all the NodeJS dependencies by typing `npm install`
* Because the app was created with express-train (https://github.com/autoric/express-train), you can start the node server with the command `train run`
    - Install express-train globally with `npm install -g express-train`

For a working example, give this a try: http://list-less.herokuapp.com/