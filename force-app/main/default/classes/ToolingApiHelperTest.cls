@isTest
public with sharing class ToolingApiHelperTest 
{
    @isTest 
    static void SelectMetadataTest()
    {
        Test.setMock(HttpCalloutMock.class, new ToolingApiMock());
        string response = ToolingApiHelper.SelectMetadata('CustomObject');

        system.assertNotEquals(null, response);
    }

    @isTest 
    static void SelectMetadataEmptyTest()
    {
        Test.setMock(HttpCalloutMock.class, new ToolingApiMock());
        string response = ToolingApiHelper.SelectMetadata(null);

        system.assertNotEquals(null, response);
    }
}