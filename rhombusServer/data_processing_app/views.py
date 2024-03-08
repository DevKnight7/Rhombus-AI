from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
import dateutil.parser as parser
import json

def convert_data_type(column):
  score = {
    'integer': 0,
    'float': 0,
    'boolean': 0,
    'datetime': 0,
    'category': 0,
    'complex': 0,
    'string': 0
  }

  for value in column:

    try:
      val = float(value)
      if val.is_integer():
          score['integer'] += 1
      else:
          score['float'] += 1
      continue
    except ValueError:
        pass
    
    try:
      if not value.isdigit() :
        complex(value)
        score['complex'] += 1
        continue
    except ValueError:
        pass

    try:
      val  = parser.parse(value)
      score['datetime'] += 1
      continue
    except ValueError:
      pass
      
        
    try:
      bool_list = ["True", "False", "TRUE",
             "FALSE", "true", "false", '0', '1']
      if value in bool_list:
        score['boolean'] += 1
        continue
    except ValueError:
      pass


    try:
      val = str(value)
      score['string'] += 1
      continue
    except ValueError:
      pass


  return max(score, key=score.get)


def get_data_types(data_frame):
  column_data_types = {}

  for col in data_frame.columns:
    if data_frame[col].dtype == 'int64' or data_frame[col].dtype == 'int32' or data_frame[col].dtype == 'int16' or data_frame[col].dtype == 'int8':
      content = data_frame[col].tolist()
      column_data_types[col] = {
          'data_type': 'integer',
          'content': content
        }
      
      continue

    if data_frame[col].dtype == 'float64' or data_frame[col].dtype == 'float32' or data_frame[col].dtype == 'float16':
      content = data_frame[col].tolist()
      column_data_types[col] = {
        'data_type': 'float',
        'content': content
      }
      continue

    if data_frame[col].dtype == 'bool':
      content = data_frame[col].tolist()
      column_data_types[col] = {
        'data_type': 'bool',
        'content': content
      }
      continue

    if data_frame[col].dtype == 'datetime64' or data_frame[col].dtype == 'timedelta[ns]':
      content = data_frame[col].tolist()
      column_data_types[col] = {
        'data_type': 'datetime',
        'content': content
      }
      continue

    if data_frame[col].dtype == 'category':
      content = data_frame[col].tolist()
      column_data_types[col] = {
        'data_type': 'category',
        'content': content
      }
      continue

    if data_frame[col].dtype == 'complex':
      content = data_frame[col].tolist()
      column_data_types[col] = {
        'data_type': 'complex',
        'content': content
      }
      continue

    if data_frame[col].dtype == 'object':
      content = data_frame[col].tolist()
      column_data_types[col] = {
        'data_type': convert_data_type(data_frame[col].dropna()),
        'content': content
      }
      continue

  json_data = json.dumps(column_data_types)
  return json_data
            

def read_data(uploaded_file):
    file_extension = uploaded_file.name
    print("file extension", file_extension)
    if file_extension.endswith('.csv'):
        return pd.read_csv(uploaded_file)
    elif file_extension.endswith('.xlsx'):
        return pd.read_excel(uploaded_file)
    else:
        raise ValueError("Unsupported file format. Please provide a CSV or Excel file.")
    
@csrf_exempt
def process_data(request):
    if request.method == 'POST':
        uploaded_file = request.FILES.get('file')

        if uploaded_file:
            data = read_data(uploaded_file)
            data_types = get_data_types(data)

            return JsonResponse(data_types, safe=False)
        else:
            return JsonResponse({"message": "No file uploaded."})
    else:
        return JsonResponse({"message": "Unsupported HTTP method."}, status=405)
