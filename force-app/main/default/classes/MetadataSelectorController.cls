public with sharing class MetadataSelectorController 
{
    @AuraEnabled(cacheable=true)
    public static string RetrieveDependencies(string selectedMetadata) 
    {
        return ToolingApiHelper.SelectMetadata(selectedMetadata);
    }
}
