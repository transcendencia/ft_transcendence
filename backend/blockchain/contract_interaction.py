import web3
from web3 import Web3
from dotenv import load_dotenv
import os
import traceback
from .web3_config import w3

# Load environment variables from .env file
load_dotenv()

# Get sender address and private key from environment variables
SENDER_ADDRESS = os.getenv('SENDER_ADDRESS')
if not SENDER_ADDRESS:
    raise ValueError("SENDER_ADDRESS is not set in the environment variables")
PRIVATE_KEY = os.getenv('PRIVATE_KEY')
if not PRIVATE_KEY:
    raise ValueError("PRIVATE_KEY is not set in the environment variables")

# Contract details
CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS')
if not CONTRACT_ADDRESS:
    raise ValueError("CONTRACT_ADDRESS is not set in the environment variables")
CONTRACT_ABI = [
    {"inputs":[],"name":"getAll","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getLatest","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}
]
# Initialize contract
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)

def get_all_stored_data():
    return contract.functions.getAll().call()

# def get_latest_stored_data():
    # return contract.functions.getLatest().call()

def set_stored_data(value):
    try:        
        # Get the nonce
        nonce = w3.eth.get_transaction_count(SENDER_ADDRESS)
        
        # Get the function object
        set_value_function = contract.functions.set(value)
        
        # Estimate gas
        gas_estimate = set_value_function.estimate_gas({'from': SENDER_ADDRESS})
        print(f"Gas estimate: {gas_estimate}")
        
        # Build transaction
        txn = set_value_function.build_transaction({
            'chainId': 11155111,  # Sepolia chain ID
            'gas': gas_estimate,
            'gasPrice': w3.eth.gas_price,
            'nonce': nonce,
            'from': SENDER_ADDRESS,
        })
        print(f"Transaction built: {txn}")
        
        # Sign transaction
        signed_txn = w3.eth.account.sign_transaction(txn, PRIVATE_KEY)
        print("Transaction signed")
        
        # Send transaction
        tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        print(f"Transaction sent. Hash: {tx_hash.hex()}")
        
        # Wait for transaction receipt
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Transaction receipt received: {tx_receipt}")
        
        return tx_receipt
    except Exception as e:
        print(f"Error in set_stored_data: {str(e)}")
        traceback.print_exc()  # This will print the full traceback
        return None

# Debugging: Check contract initialization
print(f"Contract initialized: {contract}")
