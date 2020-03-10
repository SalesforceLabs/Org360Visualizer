@isTest
public with sharing class ToolingApiHelperTest 
{
    @isTest 
    static void SendAPIRequestTest()
    {
        Test.setMock(HttpCalloutMock.class, new ToolingApiMock());
        string response = ToolingApiHelper.SendAPIRequest('SELECT MetadataComponentId, MetadataComponentName, MetadataComponentType, RefMetadataComponentId, RefMetadataComponentName, RefMetadataComponentType FROM MetadataComponentDependency');

        system.assertNotEquals(null, response);
    }
}