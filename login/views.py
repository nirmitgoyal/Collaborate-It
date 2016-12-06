from django.shortcuts import render
from django.http import HttpResponse
from .models import User	
from django.shortcuts import render
# Create your views here.


def index (request):
	context={}
	return render(request, 'login/index.html',context)