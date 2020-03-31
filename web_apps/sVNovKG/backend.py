import dataiku
import pandas as pd
from flask import request


dataset_name = "SCB_prep"


@app.route('/init')
def init():

    mydataset = dataiku.Dataset(dataset_name)
    mydataset_df = mydataset.get_dataframe(sampling='head', limit=max_rows)

    # Pandas dataFrames are not directly JSON serializable, use to_json()
    data = mydataset_df.to_json()
    return json.dumps({"status": "ok", "data": data})
