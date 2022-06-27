from ast import literal_eval
from itertools import chain, zip_longest

from flask import Flask, render_template, redirect, url_for, jsonify, request

app = Flask(__name__)

CALCULATE_STRING = 'calculate'
ERROR_STRING = 'ERROR'
INDEX_PAGE = 'index.html'
CALCULATE_ROUTE = f'/{CALCULATE_STRING}'
PERFORM_CALCULATION_ROUTE = f'/_{CALCULATE_STRING}'

NUMBERS_PARAMETER = 'numbers'
OPERATORS_PARAMETER = 'operators'


@app.route('/')
def index():
    return redirect(url_for(CALCULATE_STRING))


@app.route(CALCULATE_ROUTE)
def calculate():
    return render_template(INDEX_PAGE)


@app.route(PERFORM_CALCULATION_ROUTE)
def perform_calculation():
    try:
        numbers = request.args.get(NUMBERS_PARAMETER, [])
        operators = request.args.get(OPERATORS_PARAMETER, [])
        number_array = literal_eval(numbers)
        operator_array = literal_eval(operators)
        interleaved_stream = "".join(x for x in chain(*zip_longest(number_array, operator_array)) if x is not None)

        interleaved_stream = interleaved_stream.replace("x", "*")
        result = eval(interleaved_stream)
    except Exception:
        result = ERROR_STRING

    return jsonify(result=result)


def run_app():
    # running on 0.0.0.0, port=80 so it can be opened using http://127.0.0.1 in browser, change to 443 for https
    app.run(host='0.0.0.0', port=80, debug=True)


if __name__ == '__main__':
    run_app()
