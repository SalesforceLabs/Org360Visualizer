public with sharing class ToolingAPIHelper 
{
    public static string selectMetadata(string metadata)
    {
        return selectMetadata(metadata, '');
    }

    public static string selectMetadata(string metadata, string referenceMetadataTypes)
    {
        string selectQuery = 'SELECT MetadataComponentId, MetadataComponentName, MetadataComponentType, RefMetadataComponentId, RefMetadataComponentName, RefMetadataComponentType FROM MetadataComponentDependency';
        string whereQuery = ' WHERE ';
        string whereQueryMetadata = 'MetadataComponentType=\'' + metadata + '\'';
        string whereQueryReferenceTypes = 'RefMetadataComponentType IN (' + referenceMetadataTypes + ')';

        //string completeQuery = '';

        if(!string.isEmpty(metadata) || !string.isEmpty(referenceMetadataTypes))
        {
            selectQuery += whereQuery;

            if(!string.isEmpty(metadata) && !string.isEmpty(referenceMetadataTypes))
            {
                selectQuery += string.join(new List<string> { whereQueryMetadata, whereQueryReferenceTypes }, ' AND ');
            }
            else if(!string.isEmpty(metadata))
            {
                selectQuery += whereQueryMetadata;
            }
            else if(!string.isEmpty(referenceMetadataTypes))
            {
                selectQuery += whereQueryReferenceTypes;
            }
        }

        system.debug(selectQuery);
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