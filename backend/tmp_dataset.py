import pandas as pd
from datetime import datetime

'''

'''
df = pd.read_csv('dati.csv')

# print dataframe column name
print(df.columns)
fields = ['DataOraIncidente', 'Localizzazione1', 'STRADA1', 'NaturaIncidente', 'particolaritastrade', 'NUM_FERITI', 'NUM_MORTI', 'Latitudine', 'Longitudine']
df = df[fields]
# delete rows with NaN values
df = df.dropna()

# delete rows with data not in "%d/%m/%Y %H:%M" format
df = df[df['DataOraIncidente'].str.match(r'\d{2}/\d{2}/\d{4} \d{2}:\d{2}')]

# convert the date to epoch unix
df['DataOraIncidente'] = pd.to_datetime(df['DataOraIncidente'], format="mixed")

# convert the date to epoch unix
df['DataOraIncidente'] = df['DataOraIncidente'].astype('int64')

# select the lowest date and the highest date
#print(datetime.fromtimestamp(df['DataOraIncidente'].min()))
#print(datetime.fromtimestamp(df['DataOraIncidente'].max())x)
print(df.head(10))

print(len(df))