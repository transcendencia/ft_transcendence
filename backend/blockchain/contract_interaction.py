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

# CONTRACT_ABI = [
#     {"inputs":[{"components":[{"internalType":"string","name":"tournamentPhase","type":"string"},{"internalType":"uint16","name":"player1Id","type":"uint16"},{"internalType":"uint8","name":"scorePlayer1","type":"uint8"},{"internalType":"uint8","name":"scorePlayer2","type":"uint8"},{"internalType":"uint16","name":"player2Id","type":"uint16"},{"internalType":"uint16","name":"player3Id","type":"uint16"},{"internalType":"bool","name":"isPlayer2NoPlayer","type":"bool"},{"internalType":"bool","name":"isPlayer3NoPlayer","type":"bool"}],"internalType":"struct TournamentManager.Match[]","name":"_matches","type":"tuple[]"}],"name":"createTournament","outputs":[],"stateMutability":"nonpayable","type":"function"},
#     {"inputs":[{"internalType":"uint16","name":"_tournamentId","type":"uint16"}],"name":"getTournament","outputs":[{"components":[{"internalType":"string","name":"tournamentPhase","type":"string"},{"internalType":"uint16","name":"player1Id","type":"uint16"},{"internalType":"uint8","name":"scorePlayer1","type":"uint8"},{"internalType":"uint8","name":"scorePlayer2","type":"uint8"},{"internalType":"uint16","name":"player2Id","type":"uint16"},{"internalType":"uint16","name":"player3Id","type":"uint16"},{"internalType":"bool","name":"isPlayer2NoPlayer","type":"bool"},{"internalType":"bool","name":"isPlayer3NoPlayer","type":"bool"}],"internalType":"struct TournamentManager.Match[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
#     {"inputs":[],"name":"getAllTournaments","outputs":[{"components":[{"internalType":"uint16","name":"id","type":"uint16"},{"components":[{"internalType":"string","name":"tournamentPhase","type":"string"},{"internalType":"uint16","name":"player1Id","type":"uint16"},{"internalType":"uint8","name":"scorePlayer1","type":"uint8"},{"internalType":"uint8","name":"scorePlayer2","type":"uint8"},{"internalType":"uint16","name":"player2Id","type":"uint16"},{"internalType":"uint16","name":"player3Id","type":"uint16"},{"internalType":"bool","name":"isPlayer2NoPlayer","type":"bool"},{"internalType":"bool","name":"isPlayer3NoPlayer","type":"bool"}],"internalType":"struct TournamentManager.Match[]","name":"matches","type":"tuple[]"}],"internalType":"struct TournamentManager.Tournament[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"}
# ]

CONTRACT_ABI = [
    {"inputs":[{"components":[{"internalType":"string","name":"tournamentPhase","type":"string"},{"internalType":"uint16","name":"player1Id","type":"uint16"},{"internalType":"uint8","name":"scorePlayer1","type":"uint8"},{"internalType":"uint8","name":"scorePlayer2","type":"uint8"},{"internalType":"uint16","name":"player2Id","type":"uint16"},{"internalType":"uint16","name":"player3Id","type":"uint16"},{"internalType":"bool","name":"isPlayer2NoPlayer","type":"bool"},{"internalType":"bool","name":"isPlayer3NoPlayer","type":"bool"}],"internalType":"struct TournamentManager.Match[]","name":"_matches","type":"tuple[]"}],"name":"createTournament","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint16","name":"_tournamentId","type":"uint16"}],"name":"getTournament","outputs":[{"components":[{"internalType":"string","name":"tournamentPhase","type":"string"},{"internalType":"uint16","name":"player1Id","type":"uint16"},{"internalType":"uint8","name":"scorePlayer1","type":"uint8"},{"internalType":"uint8","name":"scorePlayer2","type":"uint8"},{"internalType":"uint16","name":"player2Id","type":"uint16"},{"internalType":"uint16","name":"player3Id","type":"uint16"},{"internalType":"bool","name":"isPlayer2NoPlayer","type":"bool"},{"internalType":"bool","name":"isPlayer3NoPlayer","type":"bool"}],"internalType":"struct TournamentManager.Match[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getAllTournaments","outputs":[{"components":[{"internalType":"uint16","name":"id","type":"uint16"},{"components":[{"internalType":"string","name":"tournamentPhase","type":"string"},{"internalType":"uint16","name":"player1Id","type":"uint16"},{"internalType":"uint8","name":"scorePlayer1","type":"uint8"},{"internalType":"uint8","name":"scorePlayer2","type":"uint8"},{"internalType":"uint16","name":"player2Id","type":"uint16"},{"internalType":"uint16","name":"player3Id","type":"uint16"},{"internalType":"bool","name":"isPlayer2NoPlayer","type":"bool"},{"internalType":"bool","name":"isPlayer3NoPlayer","type":"bool"}],"internalType":"struct TournamentManager.Match[]","name":"matches","type":"tuple[]"}],"internalType":"struct TournamentManager.Tournament[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
    {"anonymous":False,"inputs":[{"indexed":True,"internalType":"uint16","name":"tournamentId","type":"uint16"}],"name":"TournamentCreated","type":"event"}
]


# Initialize Web3 and contract
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)

def create_tournament(matches):
    try:
        # Get the nonce
        nonce = w3.eth.get_transaction_count(SENDER_ADDRESS)
        
        # Get the function object
        create_tournament_function = contract.functions.createTournament(matches)
        
        # Estimate gas
        gas_estimate = create_tournament_function.estimate_gas({'from': SENDER_ADDRESS})
        print(f"Gas estimate: {gas_estimate}")
        
        # Build transaction
        txn = create_tournament_function.build_transaction({
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
        print(f"Error in create_tournament: {str(e)}")
        traceback.print_exc()  # This will print the full traceback
        return None

def get_tournament(tournament_id):
    try:
        return contract.functions.getTournament(tournament_id).call()
    except Exception as e:
        print(f"Error in get_tournament: {str(e)}")
        traceback.print_exc()
        return None

def get_all_tournaments():
    # try:
    #     tournaments = contract.functions.getAllTournaments().call()

    #     # Create event filter for TournamentCreated
        # event_filter = contract.events.TournamentCreated.createFilter(fromBlock=0)
        # events = event_filter.get_all_entries()
        # transaction_hashes = {event.args.tournamentId: event.transactionHash.hex() for event in events}

    #     tournament_details = []
    #     for tournament in tournaments:
    #         tournament_id = tournament['id']  # Ensure this key exists in your tournament data
    #         transaction_hash = transaction_hashes.get(tournament_id, "Not Found")

    #         tournament_details.append({
    #             'id': tournament_id,
    #             'transaction_hash': transaction_hash,
    #             'details': tournament  # Include additional details if needed
    #         })

    #     return tournament_details

    # except Exception as e:
    #     print(f"Error in get_all_tournaments: {str(e)}")
    #     traceback.print_exc()
    #     return None
    # try:
    #     tournaments = contract.functions.getAllTournaments().call()

    #     event_filter = contract.events.TournamentCreated.createFilter(fromBlock=0)
    #     events = event_filter.get_all_entries()
    #     transaction_hashes = {event.args.tournamentId: event.transactionHash.hex() for event in events}
    #     print(transaction_hashes)

    #     return tournaments
    # except Exception as e:
    #     print(f"Error in get_all_tournaments: {str(e)}")
    #     traceback.print_exc()
    #     return None
    try:
        # Get all tournaments
        tournaments = contract.functions.getAllTournaments().call()

        # Define the event signature for TournamentCreated
        event_signature = web3.keccak(text="TournamentCreated(uint16)").hex()

        # Fetch logs for the event
        logs = web3.eth.get_logs({
            'fromBlock': 0,
            'toBlock': 'latest',
            'address': CONTRACT_ADDRESS,
            'topics': [event_signature]
        })

        # Parse logs to get transaction hashes
        transaction_hashes = {}
        for log in logs:
            # Decode log data to extract the event information
            event_data = contract.events.TournamentCreated().processLog(log)
            tournament_id = event_data['args']['tournamentId']
            transaction_hashes[tournament_id] = log['transactionHash'].hex()

        # Prepare tournament details with transaction hashes
        tournament_details = []
        for tournament in tournaments:
            tournament_id = tournament['id']  # Adjust this according to your tournament structure
            transaction_hash = transaction_hashes.get(tournament_id, "Not Found")

            tournament_details.append({
                'id': tournament_id,
                'transaction_hash': transaction_hash,
                'details': tournament  # Include additional details if needed
            })

        return tournament_details

    except Exception as e:
        print(f"Error in get_all_tournaments: {str(e)}")
        traceback.print_exc()
        return None
   

# Debugging: Check contract initialization
print(f"Contract initialized: {contract}")
