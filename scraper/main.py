import requests
import zipfile
import io
import json

COLUMNS = ['GLOBALEVENTID',
 'SQLDATE',
 'MonthYear',
 'Year',
 'FractionDate',
 'Actor1Code',
 'Actor1Name',
 'Actor1CountryCode',
 'Actor1KnownGroupCode',
 'Actor1EthnicCode',
 'Actor1Religion1Code',
 'Actor1Religion2Code',
 'Actor1Type1Code',
 'Actor1Type2Code',
 'Actor1Type3Code',
 'Actor2Code',
 'Actor2Name',
 'Actor2CountryCode',
 'Actor2KnownGroupCode',
 'Actor2EthnicCode',
 'Actor2Religion1Code',
 'Actor2Religion2Code',
 'Actor2Type1Code',
 'Actor2Type2Code',
 'Actor2Type3Code',
 'IsRootEvent',
 'EventCode',
 'EventBaseCode',
 'EventRootCode',
 'QuadClass',
 'GoldsteinScale',
 'NumMentions',
 'NumSources',
 'NumArticles',
 'AvgTone',
 'Actor1Geo_Type',
 'Actor1Geo_FullName',
 'Actor1Geo_CountryCode',
 'Actor1Geo_ADM1Code',
 'Actor1Geo_ADM2Code',
 'Actor1Geo_Lat',
 'Actor1Geo_Long',
 'Actor1Geo_FeatureID',
 'Actor2Geo_Type',
 'Actor2Geo_FullName',
 'Actor2Geo_CountryCode',
 'Actor2Geo_ADM1Code',
 'Actor2Geo_ADM2Code',
 'Actor2Geo_Lat',
 'Actor2Geo_Long',
 'Actor2Geo_FeatureID',
 'ActionGeo_Type',
 'ActionGeo_FullName',
 'ActionGeo_CountryCode',
 'ActionGeo_ADM1Code',
 'ActionGeo_ADM2Code',
 'ActionGeo_Lat',
 'ActionGeo_Long',
 'ActionGeo_FeatureID',
 'DATEADDED',
 'SOURCEURL']

last_update_resp = requests.get('http://data.gdeltproject.org/gdeltv2/lastupdate.txt')
last_update_events_url = last_update_resp.text.split('\n')[0].split(' ')[2]


last_update_events_zip = requests.get(last_update_events_url)
file = zipfile.ZipFile(io.BytesIO(last_update_events_zip.content))

contents = file.read(file.namelist()[0])
events = map(lambda row : row.split('\t'), contents.split('\n'))

json_events = map(lambda event : json.dumps(dict(zip(COLUMNS, event))), events)
print(json_events[0])
