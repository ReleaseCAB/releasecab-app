from rest_framework.response import Response
from rest_framework.views import APIView


class APIRootView(APIView):
    def get(self, request):
        base_url = request.build_absolute_uri('/api/')
        data = {
            'users': f'{base_url}users/',
            'tenants': f'{base_url}tenants/',
            'releases': f'{base_url}releases/',
            'blackouts': f'{base_url}blackouts/',
            'communications': f'{base_url}communications/'
        }
        return Response(data)
