from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic.base import TemplateView
# from .models import User	
from rest_framework import permissions, viewsets

from login.models import Account
from login.permissions import IsAccountOwner
from login.serializers import AccountSerializer

from django.shortcuts import render
# Create your views here.


def index (request):
	context={}
	return render(request, 'login/index.html',context)


class AccountViewSet(viewsets.ModelViewSet):
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            Account.objects.create_user(**serializer.validated_data)

            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)


class IndexView(TemplateView):
    template_name = 'index.html'