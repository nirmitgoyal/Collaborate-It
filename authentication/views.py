from django.shortcuts import render
from django.contrib.auth import logout
from rest_framework import permissions, viewsets

from django.shortcuts import get_list_or_404, get_object_or_404
from authentication.models import Account
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer
import json

from django.contrib.auth import authenticate, login
from .models import Code
from rest_framework import status, views
from rest_framework.response import Response
import ipdb
from django.views.decorators.csrf import csrf_exempt

from django.http import HttpResponse


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


class LoginView(views.APIView):

    def post(self, request, format=None):
        data = json.loads(request.body)

        email = data.get('email', None)
        password = data.get('password', None)

        account = authenticate(email=email, password=password)

        if account is not None:
            if account.is_active:
                login(request, account)

                serialized = AccountSerializer(account)

                return Response(serialized.data)
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This account has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)

@csrf_exempt
def save_code(request):
    # ipdb.set_trace()
    if request.method == "POST":
        data = json.loads(request.body)
        url = data['url']
        code = data['code']
        email = data['email']
        try:
            myobject = get_object_or_404(Code, pk=url)
            myobject.code = code
            myobject.save()
            return HttpResponse(json.dumps({
                'status': 'Successful',
                'message': 'new code saved'
            }))
        except:
            myobject = Code(pk=url, code=code, email=email)
            myobject.save(force_insert=True)
            return HttpResponse(json.dumps({
                'status': 'Created',
                'message': 'url created in DB'
            }))            
    else:
        return HttpResponse(json.dumps({
            'status': 'Forbidden',
            'message': 'Only POST allowed'
        }))

def check_url(request):
    # ipdb.set_trace()
    url = request.GET.get("url",None)
    if url:
        try:
            obj = get_object_or_404(Code, pk=url)
            return HttpResponse(json.dumps({
                'status': 'success',
                'message': 'url found',
                'code': obj.code
            }))
        except:
            return HttpResponse(json.dumps({
                'status': 'failed',
                'message': 'invalid url'
            }))
    else:
        return HttpResponse(json.dumps({
            'status': 'failed',
            'message': 'invalid url'
        }))