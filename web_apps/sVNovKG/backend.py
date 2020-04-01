import dataiku
import pandas as pd
from flask import request
import datetime
import os

dataset_name = "SCB_prep"
folder_id = "BaT52kVZ"

df = dataiku.Dataset(dataset_name).get_dataframe()
col_sparkline = [i for i in df.columns if i.startswith("t_m")]
col_choice = ["6_month_avg","3_month_avg","previous_fy"]
col_pred = "model_prediction"
col_split = "Aggregation"
col_cat = "Account"

path = dataiku.Folder(folder_id).get_info()["path"]


def get_sparkline(df):
    s = list(df[col_sparkline].values)[::-1]
    s.append(df[col_pred])
    d = [str(i) for i in pd.date_range(start='1/1/2018', periods=len(col_sparkline)+1).values][::-1]
    out = zip(d,s)
    r = []
    for d0,v0 in out:
        r.append({"date":d0, "value":round(v0,2)})
    return r

df["spark"] = df.apply(get_sparkline, axis=1)

df["spark"] = df.apply(get_sparkline, axis=1)
for i in col_sparkline:
    del df[i]
    
    
@app.route('/init')
def init():
    data= df.to_dict(orient="records")
    return json.dumps({"status": "ok", "data": data, "col_choice":col_choice})


@app.route('/save', methods=['POST'])
def save():
    param = json.loads(request.get_data())

    out = pd.DataFrame(param["param"], columns=["accounts", "prediction"])
    out["timestamp"] = datetime.datetime.now()
    out.head()

    date = str(datetime.datetime.now()).split()[0]
    path0 = path+"/"+date

    try:
        os.mkdir(path0)
    except OSError:
        print ("Creation of the directory %s failed" % path)
    else:
        print ("Successfully created the directory %s " % path)

    h = str(hash(str(param)))[-5::]
    out.to_csv(path0+"/"+h+".csv", index=False)
    
    return json.dumps({"status": "ok", "data": 0})


