from django.shortcuts import render
from django.http import JsonResponse
from .contract_interaction import create_tournament, get_tournament, get_all_tournaments


from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json

from rest_framework.decorators import api_view, authentication_classes
from rest_framework.authentication import TokenAuthentication

@csrf_exempt
@require_http_methods(["POST"])
def create_tournament_view(request):
    try:
        data = json.loads(request.body)
        matches = data.get('matches', [])
        
        formatted_matches = [
            (match['tournamentPhase'], 
             int(match['player1Id']), 
             int(match['scorePlayer1']), 
             int(match['scorePlayer2']), 
             int(match['player2Id']), 
             int(match['player3Id']), 
             bool(match['isPlayer2NoPlayer']), 
             bool(match['isPlayer3NoPlayer']))
            for match in matches
        ]
        
        receipt = create_tournament(formatted_matches)
        if receipt:
            return JsonResponse({
                'status': 'success',
                'message': 'Tournament created successfully',
                'transaction_hash': receipt['transactionHash'].hex()
            })
        else:
            return JsonResponse({
                'status': 'error',
                'message': 'Failed to create tournament'
            }, status=400)
    
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=400)

@require_http_methods(["GET"])
def get_tournament_view(request, tournament_id):
    try:
        tournament_data = get_tournament(int(tournament_id))
        
        if tournament_data:
            formatted_data = [
                {
                    'tournamentPhase': match[0],
                    'player1Id': match[1],
                    'scorePlayer1': match[2],
                    'scorePlayer2': match[3],
                    'player2Id': match[4],
                    'player3Id': match[5],
                    'isPlayer2NoPlayer': match[6],
                    'isPlayer3NoPlayer': match[7]
                }
                for match in tournament_data
            ]
            return JsonResponse({
                'status': 'success',
                'tournament_data': formatted_data
            })
        else:
            return JsonResponse({
                'status': 'error',
                'message': 'Tournament not found'
            }, status=404)
    
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=400)
    

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def all_tournaments_view(request):
    try:
        tournaments = get_all_tournaments()
        
        host_id = request.user.id
        print("the host id:")
        print(host_id)

        if tournaments is None:
            return JsonResponse({'status': 'error', 'message': 'Failed to fetch tournaments'}, status=500)
        
        # Convert the tournaments data to a more JSON-friendly format and filter by host ID
        formatted_tournaments = []
        for tournament in tournaments:
            include_tournament = False
            formatted_matches = []
            for match in tournament[1]:  # tournament[1] contains the matches
                formatted_match = {
                    'tournamentPhase': match[0],
                    'player1Id': match[1],
                    'scorePlayer1': match[2],
                    'scorePlayer2': match[3],
                    'player2Id': match[4],
                    'player3Id': match[5],
                    'isPlayer2NoPlayer': match[6],
                    'isPlayer3NoPlayer': match[7]
                }
                if match[1] == host_id or match[4] == host_id:
                    include_tournament = True
                formatted_matches.append(formatted_match)
            
            if include_tournament:
                formatted_tournament = {
                    'id': tournament[0],
                    'matches': formatted_matches
                }
                formatted_tournaments.append(formatted_tournament)
        
        return JsonResponse({'status': 'success', 'tournaments': formatted_tournaments})
    
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)