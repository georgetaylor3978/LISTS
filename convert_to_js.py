import pandas as pd
import json
import traceback

try:
    file_path = "Movies and Music.xlsx"
    
    # Read all sheets into a dictionary of DataFrames
    excel_data = pd.read_excel(file_path, sheet_name=None)
    
    # Convert each sheet to a list of dictionaries
    json_data = {}
    for sheet_name, df in excel_data.items():
        # Clean the dataframe
        df = df.where(pd.notnull(df), None) # Replace NaN with None for json serialization
        json_data[sheet_name] = df.to_dict(orient='records')
        
    with open('data.js', 'w') as f:
        f.write('const collectionData = ')
        json.dump(json_data, f, indent=4)
        f.write(';')
        
    print(f"Successfully converted {list(json_data.keys())} to data.js")
except Exception as e:
    print(f"Error: {e}")
    traceback.print_exc()
