PYTHON = python3
VENV = venv

activate-env:
	@echo "source $(VENV)/bin/activate"

install:
	$(PYTHON) -m venv $(VENV)
	. $(VENV)/bin/activate; pip install --upgrade pip wheel
	. $(VENV)/bin/activate; pip install -r requirements.txt
	. $(VENV)/bin/activate; pip install -e .

test:
	. $(VENV)/bin/activate; $(PYTHON) -m unittest -v

clean:
	rm -rf build/
	rm -rf dist/
	rm -rf venv/

.PHONY: install clean test