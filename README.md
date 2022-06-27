# calculator

![img.png](images/img.png)

Sample Calculator using Flask and AJAX

## Description
Currently, all the operations are queued up as part of two arrays: number and operators. Then the arrays are 
interleaved, and the input is then evaluated by the backend once the user presses the `=` (equal) operator.

Percent operator is evaluated directly by the front end, and it does not require a call to the backend since there is
no logic to queue up the percent operator. It will also produce an error if there are queued operators and % is 
requested.

`C` - clears all the inputs and resets. This is the only input that will clear `OVERFLOW` and `ERROR` statuses.

`OVERFLOW` state occurs whenever the input grows larger than `14` positions on the main output screen. It is not
an overflow of data types.  In other words, the `-` (minus) and `.` decimal signs count toward the total count, 
so they too can cause an `OVERFLOW` state.

`ERROR` state is caused by either invalid operations (refer to %) or something broken on the backend service.

### Example
`["1", "2", "3", "4"]` and `["+", "*", "-"]` will translate to `1 + 2 * 3 - 4` and evaluate to `3`.

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
- Add parenthesis so that the order of operations can be enforced
- Refactor code in such a way so that `main` functions is part of a class and have an MVC more like structure
- Implement a secondary display where the operations are summarized (ex: 1 + 2 * 3) and visible
- Add a correct previous entry capability
- Setup GitHub actions to run tests whenever PR or a commit is pushed.