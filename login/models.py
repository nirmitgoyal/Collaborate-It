from __future__ import unicode_literals

from django.db import models
from django import forms

# Create your models here.
class User(models.Model):
	"""docstring for User"""
	name=models.CharField(max_length=100)
	email=models.CharField(max_length=100)
	password = forms.CharField(widget=forms.PasswordInput)

	def  __str__(self):
		return self.email