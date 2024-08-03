import os
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

INFURA_PROJECT_ID = os.getenv('INFURA_PROJECT_ID')

if not INFURA_PROJECT_ID:
    raise ValueError("INFURA_PROJECT_ID is not set in the environment variables")
# print(f"INFURA_PROJECT_ID: {INFURA_PROJECT_ID}")

INFURA_URL = f"https://sepolia.infura.io/v3/{INFURA_PROJECT_ID}"

w3 = Web3(Web3.HTTPProvider(INFURA_URL))
# print(f"Is connected to Ethereum network: {w3.is_connected()}")

try:
    if w3.is_connected():
        print(f"Connected to Ethereum sepolia network via Infura")
    else:
        print(f"Failed to connect to Ethereum sepolia network")

    latest_block = w3.eth.block_number
    # print(f"Latest block number: {latest_block}")
except AttributeError:
    print("Error: Your web3.py version might be outdated. Please update it.")
except Exception as e:
    print(f"An error occurred: {e}")