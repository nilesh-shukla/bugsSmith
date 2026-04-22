import sys
from pathlib import Path
import nbformat
from nbconvert.preprocessors import ExecutePreprocessor

if len(sys.argv) < 3:
    print('Usage: python execute_notebook.py <input.ipynb> <output.ipynb>')
    sys.exit(1)

input_path = Path(sys.argv[1])
output_path = Path(sys.argv[2])

nb = nbformat.read(str(input_path), as_version=4)
ep = ExecutePreprocessor(timeout=600, kernel_name='python3')
print('Executing', input_path)
try:
    ep.preprocess(nb, {'metadata': {'path': str(input_path.parent)}})
    nbformat.write(nb, str(output_path))
    print('Wrote executed notebook to', output_path)
except Exception as e:
    print('Execution failed:', e)
    sys.exit(2)
