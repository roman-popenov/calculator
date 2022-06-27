# calculator

![img.png](images/img.png)

Sample Calculator using Flask and AJAX

## Description

## How to Run
This application uses simple JavaScript and Flask to run. This application was developed using Python 3.9 and run using
Python 3.8.10 and 3.7.5. Sole dependency is `Flask==2.1.2`. The commands listed below are assumed to run on either 
`MacOS` or `Linux`. This was not tested on a Windows based machine, although they should be somewhat similar considering
all other dependencies are satisfied.

### Installing
In order to install the application please run `make install`.

### Virtual Environment
When the application is installed, to see what to run to activate virtual environment run `make activate-env`. 
Then, simply run the command that is displayed if so desired.

### Running
A) Once the virtual environment is activated, simply run `calculator`. 
B) It is also possible to run the application by running `python3 ${PATH_TO_ROOT_OF_REPOSITORY}/calculator_app.py`.

Once the app is running, it can be accessed through web browser at `http://127.0.0.1` URL.

### Additional dependencies
In order to run `make` commands `Make` needs to be installed.

1. Windows guide: https://www.technewstoday.com/install-and-use-make-in-windows/
2. MacOS has `Make` installed by default if the use have `xcode-select` installed. Another way is to run `brew install make`
3. Make package comes in default in the Ubuntu OS

## Future Improvement

- Add JS unit testing with mock actions
- Add docker file for running testing in a and launching the server app as part of a container for reproducibility
  Another possibility is to write Procfile to deploy a Flask app on the Heroku 
- There is a bug where very small numbers that are calculated by percent (%) operator are not triggering overflow
- Currently, there is no rudimentary checking of inputs before evaluating the expression, it would be good to ensure
  that the interleaved stream is a valid expression
- Exceptions are resurfaced as `ERROR` to front end, and there is no exception processing on backend
- The Calculator should probably be set as table instead of divs
