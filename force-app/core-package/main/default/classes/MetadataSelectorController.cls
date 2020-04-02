public with sharing class MetadataSelectorController 
{
    @AuraEnabled(cacheable=true)
    public static string RetrieveDependencies(string selectedMetadata, string referenceMetadataTypes) 
    {
        return ToolingApiHelper.SelectMetadata(selectedMetadata, referenceMetadataTypes);
    }
}
