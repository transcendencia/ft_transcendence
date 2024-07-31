import os
from web3 import Web3
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get Infura Project ID from environment variable
INFURA_PROJECT_ID = os.getenv('INFURA_PROJECT_ID')

if not INFURA_PROJECT_ID:
    raise ValueError("INFURA_PROJECT_ID is not set in the environment variables")
print(f"INFURA_PROJECT_ID: {INFURA_PROJECT_ID}")


# Choose the network (mainnet, goerli, sepolia, etc.)
NETWORK = 'sepolia'  # or 'mainnet', 'sepolia', etc.

# Construct the Infura URL
INFURA_URL = f"https://{NETWORK}.infura.io/v3/{INFURA_PROJECT_ID}"

# Initialize Web3 instance
w3 = Web3(Web3.HTTPProvider(INFURA_URL))

print(f"Is connected to Ethereum network: {w3.is_connected()}")

# Check connection
try:
    if w3.is_connected():
        print(f"Connected to Ethereum {NETWORK} network via Infura")
    else:
        print(f"Failed to connect to Ethereum {NETWORK} network")

    # Get the latest block number to verify connection
    latest_block = w3.eth.block_number
    print(f"Latest block number: {latest_block}")
except AttributeError:
    print("Error: Your web3.py version might be outdated. Please update it.")
    print("You can update it by running: pip install --upgrade web3")
except Exception as e:
    print(f"An error occurred: {e}")