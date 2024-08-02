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
#     {"inputs":[],"name":"getAllTournaments","outputs":[{"components":[{"internalType":"uint16","name":"id","type":"uint16"},{"components":[{"internalType":"string","name":"tournamentPhase","type":"string"},{"internalType":"uint16","name":"player1Id","type":"uint16"},{"internalType":"uint8","name":"scorePlayer1","type":"uint8"},{"internalType":"uint8","name":"scorePlayer2","type":"uint8"},{"internalType":"uint16","name":"player2Id","type":"uint16"},{"internalType":"uint16","name":"player3Id","type":"uint16"},{"internalType":"bool","name":"isPlayer2NoPlayer","type":"bool"},{"internalType":"bool","name":"isPlayer3NoPlayer","type":"bool"}],"internalType":"struct TournamentManager.Match[]","name":"matches","type":"tuple[]"}],"internalType":"struct TournamentManager.Tournament[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
#     {"anonymous":False,"inputs":[{"indexed":True,"internalType":"uint16","name":"tournamentId","type":"uint16"}],"name":"TournamentCreated","type":"event"}
# ]

CONTRACT_ABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":False,"inputs":[{"indexed":True,"internalType":"uint16","name":"tournamentId","type":"uint16"},{"indexed":False,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"TournamentCreated","type":"event"},
  {"anonymous":False,"inputs":[{"indexed":True,"internalType":"uint16","name":"tournamentId","type":"uint16"}],"name":"TournamentUpdated","type":"event"},
  {"inputs":[{"components":[{"internalType":"string","name":"tournamentPhase","type":"string"},{"internalType":"uint16","name":"player1Id","type":"uint16"},{"internalType":"uint8","name":"scorePlayer1","type":"uint8"},{"internalType":"uint8","name":"scorePlayer2","type":"uint8"},{"internalType":"uint16","name":"player2Id","type":"uint16"},{"internalType":"uint16","name":"player3Id","type":"uint16"},{"internalType":"bool","name":"isPlayer2NoPlayer","type":"bool"},{"internalType":"bool","name":"isPlayer3NoPlayer","type":"bool"}],"internalType":"struct TournamentManager.Match[]","name":"_matches","type":"tuple[]"}],"name":"createTournament","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint16","name":"_tournamentId","type":"uint16"}],"name":"getTournament","outputs":[{"components":[{"internalType":"string","name":"tournamentPhase","type":"string"},{"internalType":"uint16","name":"player1Id","type":"uint16"},{"internalType":"uint8","name":"scorePlayer1","type":"uint8"},{"internalType":"uint8","name":"scorePlayer2","type":"uint8"},{"internalType":"uint16","name":"player2Id","type":"uint16"},{"internalType":"uint16","name":"player3Id","type":"uint16"},{"internalType":"bool","name":"isPlayer2NoPlayer","type":"bool"},{"internalType":"bool","name":"isPlayer3NoPlayer","type":"bool"}],"internalType":"struct TournamentManager.Match[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getAllTournaments","outputs":[{"components":[{"internalType":"uint16","name":"id","type":"uint16"},{"components":[{"internalType":"string","name":"tournamentPhase","type":"string"},{"internalType":"uint16","name":"player1Id","type":"uint16"},{"internalType":"uint8","name":"scorePlayer1","type":"uint8"},{"internalType":"uint8","name":"scorePlayer2","type":"uint8"},{"internalType":"uint16","name":"player2Id","type":"uint16"},{"internalType":"uint16","name":"player3Id","type":"uint16"},{"internalType":"bool","name":"isPlayer2NoPlayer","type":"bool"},{"internalType":"bool","name":"isPlayer3NoPlayer","type":"bool"}],"internalType":"struct TournamentManager.Match[]","name":"matches","type":"tuple[]"},{"internalType":"bytes32","name":"transactionHash","type":"bytes32"}],"internalType":"struct TournamentManager.Tournament[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"nextTournamentId","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"}
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
    try:
        tournaments = contract.functions.getAllTournaments().call()
        
        processed_tournaments = []
        for tournament in tournaments:
            tournament_id = tournament[0]
            matches = tournament[1]
            
            # Get the event for this tournament creation
            event_filter = contract.events.TournamentCreated.create_filter(
                fromBlock=0,
                argument_filters={'tournamentId': tournament_id}
            )
            events = event_filter.get_all_entries()
            
            if events:
                # Get the most recent event (in case of multiple events with the same ID)
                event = events[-1]
                tx_hash = event['transactionHash'].hex()
            else:
                tx_hash = None
            
            processed_tournament = {
                'id': tournament_id,
                'matches': matches,
                'transaction_hash': tx_hash
            }
            processed_tournaments.append(processed_tournament)
        
        return processed_tournaments
    except Exception as e:
        print(f"Error in get_all_tournaments: {str(e)}")
        traceback.print_exc()
        return None
    

# Debugging: Check contract initialization
print(f"Contract initialized: {contract}")
