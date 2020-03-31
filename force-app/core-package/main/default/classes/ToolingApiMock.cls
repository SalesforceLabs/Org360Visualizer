public with sharing class ToolingApiMock implements HttpCalloutMock 
{
    public HTTPResponse respond(HTTPRequest req)
    {
        HttpResponse response = new HttpResponse();
        response.setHeader('Content-Type', 'application/json');
        response.setBody('{"size":1,"totalSize":1,"done":true,"queryLocator":null,"entityTypeName":"MetadataComponentDependency","records":[{"attributes":{"type":"MetadataComponentDependency","url":"/services/data/v48.0/tooling/sobjects/MetadataComponentDependency/000000000000000AAA"},"MetadataComponentId":"00h7E000001ilT7QAI","MetadataComponentName":"Campaign Layout","MetadataComponentType":"Layout","RefMetadataComponentId":"00b7E000001eUWMQA2","RefMetadataComponentName":"View Campaign Influence Report","RefMetadataComponentType":"WebLink"}]}');
        response.setStatusCode(200);
        return response;
    }
}
