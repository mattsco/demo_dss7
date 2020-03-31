import dataiku
import pandas as pd
from flask import request


dataset_name = "SCB_prep"
df = dataiku.Dataset(dataset_name).get_dataframe()
col_sparkline = [i for i in df.columns if i.startswith("t_m")]
col_choice = ["6_month_avg","3_month_avg","previous_fy"]
col_pred = "model_prediction"
col_split = "Aggregation"
col_cat = "Account"

def get_sparkline(df):
    s = list(df[col_sparkline].values)[::-1]
    s.append(df[col_pred])
    return s

df["spark"] = df.apply(get_sparkline, axis=1)
for i in col_sparkline:
    del df[i]
    
@app.route('/init')
def init():

    data = df.to_json()
    
    return json.dumps({"status": "ok", "data": data})
