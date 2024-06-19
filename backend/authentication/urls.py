from django.urls import path
from .views import authentication, tournament, updateUserInfo, gameInfo, friendship

urlpatterns = [
	path('', authentication.index, name='index'),

    #authenitcation.py
    path('login_page/', authentication.login_page, name='login_page'),
    path('signup/', authentication.signup, name='signup'),
    
    path('rgpd/', authentication.rgpd, name='rgpd'),

    #updateUserInfo.py
    path('change_language/', updateUserInfo.change_language, name='change_language'),
    path('update_status/', updateUserInfo.update_status, name='update_status'),
    path('get_status/<int:userId>', updateUserInfo.get_status, name='get_status'),
    path('change_profile_info/', updateUserInfo.change_profile_info, name="change_profile_info"),
    path('get_profile_info/', updateUserInfo.get_profile_info, name="get_profile_info"),
    path('user_list/', updateUserInfo.user_list, name="user_list"),
    path('get_user_list/', updateUserInfo.get_user_list, name="get_user_list"),
    path('get_game_player2/', gameInfo.get_game_player2, name="get_game_player2"),
    path('change_graphic_mode/', updateUserInfo.change_graphic_mode, name="change_graphic_mode"),
    path('delete_account/', updateUserInfo.delete_account, name="delete_account"),
     path('get_stats/<int:userId>', updateUserInfo.get_stats, name="get_stats"),

    path('generate_unique_username/', updateUserInfo.generate_unique_username, name="generate_unique_username"),
    
    #friendship.py
    path('send_friend_request/', friendship.send_friend_request, name="send_friend_request"),
    path('accept_friend_request/', friendship.accept_friend_request, name="accept_friend_request"),
    path('reject_friend_request/', friendship.reject_friend_request, name="reject_friend_request"),
    path('return_friends_list/', friendship.return_friends_list, name="return_friends_list"),

    #tounament.py
    path('tournament/', tournament.result, name='result'),
    path('addPlayer/', tournament.add_member, name='add_member'),
    path('add_game/', gameInfo.add_game, name='add_game'),
    path('game_list/', gameInfo.game_list, name='game_list'),
    path('get_game_list/', gameInfo.get_game_list, name='get_game_list'),
    path('get_game_user/', gameInfo.get_game_user, name='get_game_user'),

    # path('get_game_list/', gameInfo.get_game_list, name='get_game_list'),
    # path('get_game_info/', gameInfo.get_game_info, name='get_game_info'),

]