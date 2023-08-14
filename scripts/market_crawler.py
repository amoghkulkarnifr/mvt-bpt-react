from typing import List 
import requests
from requests import Response
import json

import csv
import os
from pathlib import WindowsPath
from copy import deepcopy

import time
import random
import warnings

ALPHA_VANTAGE_API_KEY = '70VCTN6Z4NYRM875'
API_FUNCTION_TYPE = 'TIME_SERIES_DAILY'
API_REPLY_FIELD_NAME = 'Time Series (Daily)'
LENGTH_OF_RECORDS_STORED = 365

def get_daily_timeseries(ticker_symbol: str) -> Response:
    url = 'https://www.alphavantage.co/query'
    payload = {
      'function': API_FUNCTION_TYPE,
      'symbol': ticker_symbol + '.NSE',
      'outputsize': 'full',
      'apikey': ALPHA_VANTAGE_API_KEY
    }

    reply = requests.get(url, params=payload)
    return json.loads(reply.text)

def read_ticker_symbols(filename) -> List[str]:
    company_names = []
    file_abs_path = WindowsPath.joinpath(
      WindowsPath.cwd(), 'data', 'market', filename)
    with open(file=file_abs_path) as f:
        file_raw_content = f.read()
        company_names = file_raw_content.split('\n')
        
    return company_names[:-1]

def random_sleep(lower: int = 5, upper: int = 10) -> None:
  sleep_duration = random.randrange(lower, upper)
  print('Sleeping for {} sec'.format(sleep_duration))
  time.sleep(sleep_duration)

if __name__ == "__main__":
  all_ticker_symbols = read_ticker_symbols('NIFTY50_constituents.txt')

  output_csv_data = WindowsPath.joinpath(
      WindowsPath.cwd(), 'data', 'market', 'market_data_output.csv')
    
  # Delete the output file if it exists 
  if os.path.exists(output_csv_data):
    os.remove(output_csv_data)

  while all_ticker_symbols:
    # Read ticker symbols from the file placed in ../data/market
    symbols_to_fetch = deepcopy(all_ticker_symbols)

    # With an open csv file..
    with open(output_csv_data, 'a', newline='') as f:
      writer = csv.writer(f)

      # Write the first row
      writer.writerow(['TICKER_SYMBOL', 'DATE', 'OPEN', 'HIGH', 'LOW', 'CLOSE', 'VOLUME'])

      for ticksym in symbols_to_fetch:
        # Fetch the response for the ticksym
        print('Fetching response for {}'.format(ticksym))
        reply = get_daily_timeseries(ticker_symbol=ticksym)
        if API_REPLY_FIELD_NAME not in reply:
          warning_msg = 'Response for {} does not have the required field'.format(ticksym)
          warnings.warn(warning_msg)
        else:
          for i, (k, v) in enumerate(reply[API_REPLY_FIELD_NAME].items()):
            if i > LENGTH_OF_RECORDS_STORED: 
              break

            _date = k
            _date_open = v['1. open']
            _date_high = v['2. high']
            _date_low = v['3. low']
            _date_close = v['4. close']
            _date_vol = v['5. volume']
            row_to_write = [
              ticksym, 
              _date, 
              _date_open, _date_high, _date_low, _date_close,
              _date_vol
            ]
            
            writer.writerow(row_to_write)

          all_ticker_symbols.remove(ticksym)
        
        # Wait for some time, so that Alpha Vantage is not angry
        random_sleep()
