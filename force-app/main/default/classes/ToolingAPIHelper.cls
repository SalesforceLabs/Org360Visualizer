public with sharing class ToolingAPIHelper 
{
    public static string SendAPIRequest(string query)
    {
        string instanceUrl = URL.getSalesforceBaseUrl().toExternalForm();
        string toolingApiUrl = '/services/data/v48.0/tooling/query?q=';
        string completeUrl = instanceUrl + toolingApiUrl + EncodingUtil.urlEncode(query, 'UTF-8');
        system.debug(completeUrl);

        HttpRequest request = new HttpRequest();
        request.setEndpoint(completeUrl);
        request.setHeader('Content-Type', 'application/json');
        request.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());
        request.setMethod('GET');

        Http http = new Http();
        HttpResponse response = http.send(request);

        string responseJson = response.getBody();
        system.debug(responseJson);
        return responseJson;
    }
}