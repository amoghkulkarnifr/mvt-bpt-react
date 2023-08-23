from typing import List 

import csv
from pathlib import WindowsPath
from copy import deepcopy

import warnings

_OUTPUT_NO_OF_YEARS = 1
OUTPUT_NO_OF_LINES = int(_OUTPUT_NO_OF_YEARS*365)

def read_ticker_symbols(filename) -> List[str]:
  company_names = []
  file_abs_path = WindowsPath.joinpath(
    WindowsPath.cwd(), 'data', 'market', filename)
  with open(file=file_abs_path) as f:
      file_raw_content = f.read()
      company_names = file_raw_content.split('\n')
  
  return company_names[:-1]

if __name__ == "__main__":
  all_ticker_symbols = read_ticker_symbols('NIFTY50_constituents.txt')

  for ticksym in all_ticker_symbols:
    if ticksym == 'M&M':
      ticksym = 'MM'            # Doesn't like '&'
    if ticksym == 'LTIM':
      ticksym = 'MINDTREE'      # LTI and Mindtree got merged after this database was created

    in_csv_data_path = WindowsPath.joinpath(
      WindowsPath.cwd(), 'data', 'market', 'nse_data__1990_2021', 
      'Datasets', 'SCRIP', ticksym + '.csv')
    
    # SEE: Delete the content of this folder before running this script
    out_csv_data_path = WindowsPath.joinpath(
      WindowsPath.cwd(), 'data', 'market', 'post_processed', ticksym + '.csv')
    
    contentToWrite = []
    
    try:
      with open(in_csv_data_path, 'r') as in_f:
        with open(out_csv_data_path, 'w', newline='') as out_f:
          _in_csv_content = list(csv.reader(in_f, delimiter=','))
          writer = csv.writer(out_f)

          # Header
          contentToWrite.append(_in_csv_content[0])
          # ...and the latest n rows, as the start of all timeseries is not same
          contentToWrite.append(_in_csv_content[-OUTPUT_NO_OF_LINES:])
          
          # Write them
          writer.writerows(contentToWrite)
    except FileNotFoundError:
      warnings.warn('Data file for {} is not found'.format(ticksym))
