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


@app.route('/init')
def init():

    df = dataiku.Dataset(dataset_name).get_dataframe()
    

    # Pandas dataFrames are not directly JSON serializable, use to_json()
    data = df.to_json()
    
    category = list(df[col_cat].values)
    return json.dumps({"status": "ok", "data": data, "category":category})
