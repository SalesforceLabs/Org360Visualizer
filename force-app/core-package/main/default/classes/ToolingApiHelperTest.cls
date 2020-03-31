@isTest
public with sharing class ToolingApiHelperTest 
{
    @isTest 
    static void selectMetadataTest()
    {
        Test.setMock(HttpCalloutMock.class, new ToolingApiMock());
        string response = ToolingApiHelper.selectMetadata('CustomObject');

        system.assertNotEquals(null, response, 'Response Has Data');
    }

    @isTest 
    static void selectMetadataEmptyTest()
    {
        Test.setMock(HttpCalloutMock.class, new ToolingApiMock());
        string response = ToolingApiHelper.selectMetadata(null);

        system.assertNotEquals(null, response, 'Response Has Data');
    }
}