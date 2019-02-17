import requests
import zipfile
import io
import os
import json
from subprocess import Popen, PIPE
import time
import shutil

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

THREAD_ID = "12D3KooWJo51aEpftjXaNWnbGU8phUrM2888NgeXkmLEGHqLo1Wk"

def add_to_thread(thread_id, filename):
    p = Popen(["textile", "files", "add", "--thread", thread_id, "--group", filename], stdout=PIPE)
    p.communicate()[0]

def archiveGdelt():
    last_update_resp = requests.get('http://data.gdeltproject.org/gdeltv2/lastupdate.txt')
    last_update_events_url = last_update_resp.text.split('\n')[0].split(' ')[2]

    last_update_events_zip = requests.get(last_update_events_url)
    file = zipfile.ZipFile(io.BytesIO(last_update_events_zip.content))
    filename = file.namelist()[0]

    contents = file.read(filename)
    raw_events = map(lambda row : row.split('\t'), str(contents).split('\n'))
    json_events = map(lambda event : dict(zip(COLUMNS, event)), raw_events)

    shutil.rmtree('tmp/', ignore_errors=True)
    os.mkdir('tmp/')
    for event in json_events:
        with open('tmp/' + event['GLOBALEVENTID'] + '.json', 'w') as f:
            json.dump(event, f)
        print(event['GLOBALEVENTID'])

    add_to_thread(THREAD_ID, 'tmp/')

    shutil.rmtree('tmp/')

if __name__ == "__main__":
    archiveGdelt()
