from google.cloud import storage
from pymongo import MongoClient
import json, random, string

mongo_client = MongoClient("mongodb://_:30dtDVpsX8OF8GxCvASpxhahvMmRAD2b0s8Pn0MlgLolkJEk2jLjH6K6fvGaMLKb@stitch.mongodb.com:27020/?authMechanism=PLAIN&authSource=%24external&ssl=true&appName=dashowl-vibbp:mongodb-atlas:api-key")
db=mongo_client.dashowl
storage_client = storage.Client()

def upload_blob(bucket_name, source_file_name, destination_blob_name):
    """Uploads a file to the bucket."""
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    print('File {} uploaded to {}.'.format(
        source_file_name,
        destination_blob_name))

def download_vid(filename, bucket_name):
  bucket = storage_client.get_bucket(bucket_name)
  blob = bucket.blob(filename)
  blob.download_to_filename("/Users/akashsinghal/documents/CalHacks5.0/DashOwl/" + filename)


def upload_vid(source_vid_file_path, metadata_file_path):
    hash = ''.join([random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(20)])
    print(hash)
    upload_blob("dashowl-test", source_vid_file_path, hash)
    collection = db['metadata']
    with open(metadata_file_path) as f:
        data = json.load(f)
    send_data = {
        "time" : data['time'],
        "lat" : data['lat'],
        "lon" : data['lon'],
        "hash" : hash,
        "accelerator" : data['accelerator'],
        "brake" : data['brake'],
        "high_beam" : data['high_beam'],
        "headlamp" : data['headlamp'],
        "windshield_wiper" : data['windshield_wiper']
    }


    collection.insert_one(send_data)

#upload_vid("sample.txt", "sample.json")
