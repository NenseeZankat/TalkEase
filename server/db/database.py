from pymongo import MongoClient
import os

client = MongoClient("mongodb://localhost:27017/")
db = client["chatbot_db"]

users_collection = db["users"]