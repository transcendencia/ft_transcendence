from django.shortcuts import render
from django.http import JsonResponse
from .contract_interaction import get_all_stored_data, set_stored_data

def blockchain_view(request):
    if request.method == 'POST':
        value = int(request.POST.get('value', 0))

        try:
            tx_receipt = set_stored_data(value)
            return JsonResponse({'status': 'success', 'transaction_hash': tx_receipt['transactionHash'].hex()})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})

    stored_data = get_all_stored_data()
    return render(request, 'blockchain.html', {'stored_data': stored_data})
