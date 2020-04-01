# -*- coding: utf-8 -*-
import dataiku
import pandas as pd, numpy as np
from dataiku import pandasutils as pdu

# Read recipe inputs
save_webapp = dataiku.Folder("BaT52kVZ")
save_webapp_info = save_webapp.get_info()


# Compute recipe outputs
# TODO: Write here your actual code that computes the outputs
# NB: DSS supports several kinds of APIs for reading and writing data. Please see doc.

ezf_df = ... # Compute a Pandas dataframe to write into ezf


# Write recipe outputs
ezf = dataiku.Dataset("ezf")
ezf.write_with_schema(ezf_df)
