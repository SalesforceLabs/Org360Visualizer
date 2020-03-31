public with sharing class ToolingAPIHelper 
{
    public static string selectMetadata(string metadata)
    {
        string selectQuery = 'SELECT MetadataComponentId, MetadataComponentName, MetadataComponentType, RefMetadataComponentId, RefMetadataComponentName, RefMetadataComponentType FROM MetadataComponentDependency';
        string whereQuery = ' WHERE RefMetadataComponentType = \'' + metadata + '\'';

        if(!string.isEmpty(metadata))
        {
            string completeQuery = selectQuery + whereQuery;
            return SendAPIRequest(completeQuery);
        }

        return SendAPIRequest(selectQuery);
    }

    public static string sendAPIRequest(string query)
    {
        string toolingApiUrl = '/services/data/v48.0/tooling/query?q=';
        string completeUrl = toolingApiUrl + EncodingUtil.urlEncode(query, 'UTF-8');

        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:MetadataVisualizerNamedCredentials' + completeUrl);
        request.setHeader('Content-Type', 'application/json');
        request.setMethod('GET');

        Http http = new Http();
        HttpResponse response = http.send(request);

        string responseJson = response.getBody();
        
        return responseJson;
    }
}