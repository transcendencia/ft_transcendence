from django.urls import path
from .views import authentication, updateUserInfo, gameInfo, friendship, stats, rgpd

from .views.updateUserInfo import UserStatusView, UserLanguageView, UserInfoView, UserGraphicModeView
from .views.friendship import FriendRequestView, FriendListView
from .views.authentication import LogoutView
from .views.stats import StatsView

from blockchain.views import blockchain_view

urlpatterns = [
	path('', authentication.index, name='index'),

    #authenitcation.py
    path('login_page/', authentication.login_page, name='login_page'),
    path('signup/', authentication.signup, name='signup'),
    path('logout/', LogoutView.as_view(), name='logout'),

    #updateUserInfo.py
    path('user/language/', UserLanguageView.as_view(), name='update_language'),
    path('user/status/', UserStatusView.as_view(), name='update_status'),
    path('user/status/<int:userId>/', UserStatusView.as_view(), name='get_status'),
    path('user_info/<int:userId>/', UserInfoView.as_view(), name='user_info'),
    path('user/graphic_mode/', UserGraphicModeView.as_view(), name='graphic_mode'),
    path('user_info/', UserInfoView.as_view(), name='user_info'),

    path('get_game_player2/', gameInfo.get_game_player2, name="get_game_player2"),
    path('delete_account/', updateUserInfo.delete_account, name="delete_account"),

    path('generate_unique_username/', updateUserInfo.generate_unique_username, name="generate_unique_username"),
    
    #friendship.py
    path('friend_request/', FriendRequestView.as_view(), name='friend_request'),
    path('friends_list/', FriendListView.as_view(), name='friend_list'),
    path('friends_list/', FriendListView.as_view(), name='friend_list'),

    #stats.py
    path('get_stats/<int:userId>', StatsView.as_view(), name="get_stats"),

    #tounament.py
    path('add_game/', gameInfo.add_game, name='add_game'),
    path('get_game_user/', gameInfo.get_game_user, name='get_game_user'),

    # path('get_game_info/', gameInfo.get_game_info, name='get_game_info'),
    #rgpd.py
    path('generateDataFile/', rgpd.generateDataFile, name='generateDataFile'),

    path('blockchain/', blockchain_view, name='blockchain'),
]