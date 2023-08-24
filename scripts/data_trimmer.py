from typing import List 

import csv
from enum import Enum
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

class Column(Enum):
  DATE = 0
  SYMBOL = 1
  SERIES = 2
  PREV_CLOSE = 3
  OPEN = 4
  HIGH = 5
  LOW = 6
  LAST = 7
  CLOSE = 8
  VWAP = 9
  VOL = 10
  TURNOVER = 11
  TRADES = 12
  DELIVERABLE_VOL = 13
  PERCENT_DEL = 14

cols_to_keep = [
  Column.DATE.value, 
  Column.OPEN.value, 
  Column.LOW.value, 
  Column.HIGH.value, 
  Column.CLOSE.value
]

cols_datatypes = {
  Column.DATE.value: str,
  Column.OPEN.value: float,
  Column.LOW.value: float,
  Column.HIGH.value: float,
  Column.CLOSE.value: float
}

def sanitize_csv_data(raw_input:List[str], header:bool=False):
  return_data = []
  
  for col in cols_to_keep:
    if not header:
      return_data.append(cols_datatypes[col](raw_input[col]))
    else:
      return_data.append(str(raw_input[col]))
  
  return return_data

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
    
    content_to_write = []
    
    try:
      with open(in_csv_data_path, 'r') as in_f:
        with open(out_csv_data_path, 'w', newline='') as out_f:
          _in_csv_content = list(csv.reader(in_f, delimiter=','))
          writer = csv.writer(out_f)

          # Header
          header_row = _in_csv_content[0]
          content_to_write.append(sanitize_csv_data(raw_input=header_row, header=True))
          for datapoint in _in_csv_content[-OUTPUT_NO_OF_LINES:]:
            # ...and the latest n rows, as the start of all timeseries is not same
            content_to_write.append(sanitize_csv_data(raw_input=datapoint))
          
          # Write them
          writer.writerows(content_to_write)
    except FileNotFoundError:
      warnings.warn('Data file for {} is not found'.format(ticksym))
